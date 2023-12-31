import {
  type AuthorizationUrlParams,
  generatePkcePair,
} from '@opengovsg/sgid-client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { sgid } from '~/lib/sgid'
import { publicProcedure, router } from '~/server/trpc'
import { getUserInfo, type SgidUserInfo } from './sgid.utils'
import { env } from '~/env.mjs'
import { HOME } from '~/lib/routes'
import { generateUsername } from '../../me/me.service'

const sgidCallbackStateSchema = z
  .custom<string>((data) => {
    try {
      JSON.parse(String(data))
    } catch (error) {
      return false
    }
    return true
  }, 'invalid json') // write whatever error you want here
  .transform((content) => JSON.parse(content))
  .pipe(
    z.object({
      landingUrl: z.string(),
    })
  )

export const sgidRouter = router({
  login: publicProcedure
    .input(
      z.object({
        landingUrl: z.string().optional().default(HOME),
      })
    )
    .mutation(async ({ ctx, input: { landingUrl } }) => {
      if (!sgid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'SGID is not enabled',
        })
      }
      if (!ctx.session) {
        // Redirect back to sign in page.
        throw new TRPCError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'Session object missing in context',
        })
      }

      const { codeChallenge, codeVerifier } = generatePkcePair()
      const options: AuthorizationUrlParams = {
        codeChallenge,
        state: JSON.stringify({ landingUrl }),
      }
      const { url, nonce } = sgid.authorizationUrl(options)

      // Reset session
      ctx.session.destroy()
      // Store the code verifier and nonce in the session to retrieve in the callback.
      ctx.session.sgidSessionState = {
        codeVerifier,
        nonce,
      }
      await ctx.session.save()

      return {
        redirectUrl: url,
      }
    }),
  callback: publicProcedure
    .input(
      z.object({
        state: z.string(),
        code: z.string(),
      })
    )
    .query(async ({ ctx, input: { state, code } }) => {
      if (!env.NEXT_PUBLIC_ENABLE_SGID) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'SGID is not enabled',
        })
      }
      if (!ctx.session?.sgidSessionState) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid login flow',
        })
      }
      const parsedState = sgidCallbackStateSchema.safeParse(state)
      if (!parsedState.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid SGID callback state',
        })
      }

      const { codeVerifier, nonce } = ctx.session.sgidSessionState
      let sgidUserInfo: SgidUserInfo

      try {
        const userInfo = await getUserInfo({ code, codeVerifier, nonce })
        sgidUserInfo = userInfo
      } catch (error) {
        // Redirect back to sign in page with error.
        ctx.session.destroy()
        return {
          redirectUrl: `/sign-in?error=${
            (error as Error).message ||
            'Something went wrong whilst fetching SGID user info'
          }`,
        }
      }

      const sgidUserEmail = sgidUserInfo.data.email
      const name = sgidUserInfo.data['myinfo.name']
      const user = await ctx.prisma.user.create({
        data: {
          email: sgidUserEmail,
          emailVerified: new Date(),
          name: sgidUserInfo.data['myinfo.name'],
          username: generateUsername(name ?? sgidUserEmail),
        },
      })

      ctx.session.destroy()
      ctx.session.user = user
      await ctx.session.save()

      return {
        redirectUrl: parsedState.data.landingUrl,
      }
    }),
})
