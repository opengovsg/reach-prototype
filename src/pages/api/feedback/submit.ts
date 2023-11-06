import { type NextApiRequest, type NextApiResponse } from 'next'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'

import { appRouter } from '~/server/modules/_app'
import { createContext } from '~/server/context'
import { TRPCError } from '@trpc/server'
import formsg from '@opengovsg/formsg-sdk'
import { type submitFeedbackInput } from '~/schemas/feedback'

const POST_URI = 'https://reach-prototype.phonebook.gov.sg/api/feedback/submit'
const formSecretKey = process.env.FORM_SECRET_KEY ?? ''
const form = formsg()

const submitFeedbackHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createContext({ req, res })
  const caller = appRouter.createCaller(ctx)
  try {
    let signature = ''
    if (Array.isArray(req.headers['x-formsg-signature'])) {
      signature = req.headers['x-formsg-signature'][0] ?? ''
    } else {
      signature = req.headers['x-formsg-signature'] ?? ''
    }
    form.webhooks.authenticate(signature, POST_URI)
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const submission = form.crypto.decrypt(formSecretKey, req.body.data)
    const submitFeedback: submitFeedbackInput = {
      name: '',
      email: '',
      contactNumber: '',
      subject: '',
      feedbackDetail: '',
    }
    submission?.responses?.map((response) => {
      console.log(
        'question',
        response.question,
        'answer',
        response.answer,
        'answer type',
        typeof response.answer
      )
      switch (response.question) {
        case 'Name':
          submitFeedback.name = response.answer ?? ''
          break
        case 'Email':
          submitFeedback.email = response.answer ?? ''
          break
        case 'Contact Number':
          submitFeedback.contactNumber = response.answer ?? ''
          break
        case 'Subject':
          submitFeedback.subject = response.answer ?? ''
          break
        case 'Feedback Detail':
          submitFeedback.feedbackDetail = response.answer ?? ''
          break
      }
    })
    console.log('submitFeedback', JSON.stringify(submitFeedback))
    await caller.feedback.submitFeedback(submitFeedback)
    res.status(201).end()
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause)
      return res.status(httpCode).json(cause.cause)
    }
    // Another error occured
    console.error(cause)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default submitFeedbackHandler
