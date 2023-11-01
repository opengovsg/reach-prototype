import { trpc } from '~/utils/trpc'
import { EmptyFeedbackList } from './EmptyFeedbackList'
import { Stack, StackDivider } from '@chakra-ui/react'
import { APP_GRID_COLUMN } from '~/constants/layouts'
import { AgencyFeedbacksTable } from './AgencyFeedbacksTable'
import { FeedbacksTable } from './FeedbacksTable'

export const FeedbacksList = (): JSX.Element => {
  const [data] = trpc.feedback.getFeedbacks.useSuspenseQuery()

  if (data.length === 0) {
    return <EmptyFeedbackList />
  }
  const feedbackAddressedGroup = data
    .filter((feedback) => feedback.feedbackForwarded)
    .reduce((acc: { [key: string]: number }, curr) => {
      const agency = curr.forwardedAgency
      if (agency) {
        acc[agency] = (acc[agency] || 0) + 1
      }
      return acc
    }, {})

  const feedbackNotAddressed = data.filter(
    (feedback) => !feedback.feedbackForwarded
  )
  return (
    <Stack spacing={12} gridColumn={APP_GRID_COLUMN} flexDir="column">
      <AgencyFeedbacksTable feedbackAddressedGroup={feedbackAddressedGroup} />
      <FeedbacksTable feedbacks={feedbackNotAddressed} />
    </Stack>
  )
}
