/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc'
import { authRouter } from './auth/auth.router'
import { feedbackRouter } from './feedback/feedback.router'

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  feedback: feedbackRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter
