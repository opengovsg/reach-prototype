import { z } from 'zod'

export const submitFeedbackSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  contactNumber: z.string().min(1).max(15).optional(),
  subject: z.string().min(1).max(100),
  feedbackDetail: z.string().min(1).max(5010),
})
export type submitFeedbackInput = z.infer<typeof submitFeedbackSchema>
