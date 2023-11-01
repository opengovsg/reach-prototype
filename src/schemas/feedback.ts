import { z } from 'zod'

export const submitFeedbackSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  contactNumber: z.string().min(1).max(8).optional(),
  subject: z.string().min(1).max(50),
  feedbackDetail: z.string().min(1).max(5000),
})
export type submitFeedbackInput = z.infer<typeof submitFeedbackSchema>
