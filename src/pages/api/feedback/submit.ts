import { type NextApiRequest, type NextApiResponse } from 'next'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'

import { appRouter } from '~/server/modules/_app'
import { createContext } from '~/server/context'
import { TRPCError } from '@trpc/server'

const submitFeedbackHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createContext({ req, res })
  const caller = appRouter.createCaller(ctx)
  try {
    const body = req.body
    await caller.feedback.submitFeedback(body)
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
