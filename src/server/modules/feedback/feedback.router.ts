import { publicProcedure, router } from '~/server/trpc'
import { submitFeedbackSchema } from '~/schemas/feedback'
import { sendMail } from '~/lib/mail'
export const feedbackRouter = router({
  submitFeedback: publicProcedure
    .input(submitFeedbackSchema)
    .mutation(async ({ input, ctx }) => {
      await Promise.all([
        await ctx.prisma.incomingFeedback.create({
          data: {
            name: input.name,
            email: input.email,
            contactNumber: input.contactNumber,
            subject: input.subject,
            feedbackDetail: input.feedbackDetail,
          },
        }),
        sendMail({
          subject: `Thank you for your feedback!`,
          body: `Hi ${input.name},<br><br>
          Thank you for your feedback for ${input.subject}. We have forwarded to the respective department for review.<br><br>
          Regards,<br>
          ReachGovSg`,
          recipient: input.email,
        }),
      ])
    }),
})
