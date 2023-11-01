import { publicProcedure, protectedProcedure, router } from '~/server/trpc'
import { submitFeedbackSchema } from '~/schemas/feedback'
import { sendMail } from '~/lib/mail'
import { TRPCError } from '@trpc/server'
import { feedbackToAgencyMap } from './constants'
import { z } from 'zod'

export const feedbackRouter = router({
  submitFeedback: publicProcedure
    .input(submitFeedbackSchema)
    .mutation(async ({ input, ctx }) => {
      let agency: string = ''
      await ctx.prisma.$transaction(async (tx) => {
        const feedback = await tx.incomingFeedback.create({
          data: {
            name: input.name,
            email: input.email,
            contactNumber: input.contactNumber,
            subject: input.subject,
            feedbackDetail: input.feedbackDetail,
          },
        })
        await sendEmailToSubmitter(input)
        await tx.incomingFeedback.update({
          where: {
            id: feedback.id,
          },
          data: {
            feedbackResponded: true,
          },
        })
        Object.keys(feedbackToAgencyMap).map((key) => {
          if (input.subject.toLowerCase().includes(key)) {
            agency = feedbackToAgencyMap[key] ?? ''
          }
        })
        if (agency) {
          await sendEmailToAgency(input, agency)

          await tx.incomingFeedback.update({
            where: {
              id: feedback.id,
            },
            data: {
              feedbackForwarded: true,
              forwardedAgency: agency,
            },
          })
        }
      })
    }),
  getFeedbacks: protectedProcedure.query(async ({ ctx }) => {
    const feedbacks = await ctx.prisma.incomingFeedback.findMany({})
    return feedbacks.map((feedback) => {
      return {
        id: feedback.id,
        subject: feedback.subject,
        feedbackDetail: feedback.feedbackDetail,
        feedbackResponded: feedback.feedbackResponded,
        feedbackForwarded: feedback.feedbackForwarded,
        forwardedAgency: feedback.forwardedAgency,
      }
    })
  }),
  updateFeedback: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        agency: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, agency } = input
      await ctx.prisma.$transaction(async (tx) => {
        const feedback = await tx.incomingFeedback.findUnique({
          where: {
            id,
          },
        })
        if (!feedback) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No feedback with id '${id}'`,
          })
        }
        await sendEmailToAgency(
          {
            name: feedback.name,
            email: feedback.email,
            subject: feedback.subject,
            feedbackDetail: feedback.feedbackDetail,
            contactNumber: feedback.contactNumber,
          },
          agency
        )
        await sendEmailToSubmitter({
          name: feedback.name,
          email: feedback.email,
          subject: feedback.subject,
        })

        await tx.incomingFeedback.update({
          where: {
            id,
          },
          data: {
            feedbackResponded: true,
            feedbackForwarded: true,
            forwardedAgency: agency,
          },
        })
      })
    }),
})
async function sendEmailToSubmitter(input: {
  name: string
  email: string
  subject: string
}) {
  await sendMail({
    subject: `Thank you for your feedback!`,
    body: `Hi ${input.name},<br><br>
            Thank you for your feedback for ${input.subject}. We have forwarded to the respective department for review.<br><br>
            Regards,<br>
            ReachGovSg`,
    recipient: input.email,
  })
}

async function sendEmailToAgency(
  input: {
    name: string
    email: string
    subject: string
    feedbackDetail: string
    contactNumber?: string | null
  },
  agency: string
) {
  await sendMail({
    subject: `A citizen feedback regarding ${input.subject}`,
    body: `Dear ${agency},<br><br>
                      We have received a citizen feedback regarding ${input.subject}. Please do the needful.<br><br>
                      <table>
                      <tr>
                      <td><strong>Name: </strong></td>
                      <td>${input.name}</td>
                      </tr>
                      <tr>
                      <td><strong>Email: </strong></td>
                      <td>${input.email}</td>
                      </tr>
                      <tr>
                      <td><strong>Contact Number: </strong></td>
                      <td>${input.contactNumber}</td>
                      </tr>
                      <tr>
                      <td><strong>Subject: </strong></td>
                      <td>${input.subject}</td>
                      </tr>
                      <tr>
                      <td><strong>Feedback Detail: </strong></td>
                      <td>${input.feedbackDetail}</td>
                      </tr>
                      </table>
                      <br><br>
                      Regards,<br>
                      ReachGovSg`,
    recipient: input.email,
  })
}
