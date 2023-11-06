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
    // check if signature is of type array
    console.log('form headers', req.headers)
    console.log('form signature header', req.headers['X-FormSG-Signature'])
    if (Array.isArray(req.headers['X-FormSG-Signature'])) {
      signature = req.headers['X-FormSG-Signature'][0] ?? ''
    }
    form.webhooks.authenticate(signature, POST_URI)
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const submission = form.crypto.decrypt(formSecretKey, req.body.data)
    console.log('submission data', submission)
    const submitFeedback: submitFeedbackInput = {
      name: '',
      email: '',
      contactNumber: '',
      subject: '',
      feedbackDetail: '',
    }
    submission?.responses?.map((response) => {
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
