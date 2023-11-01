import { trpc } from '~/utils/trpc'
import { EmptyFeedbackList } from './EmptyFeedbackList'
import { Stack, StackDivider } from '@chakra-ui/react'
import { APP_GRID_COLUMN } from '~/constants/layouts'
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
    console.log(data)
  const feedbackNotAddressed = data.filter(
    (feedback) => !feedback.feedbackForwarded
  )
  return (
    <Stack
      spacing={0}
      divider={<StackDivider />}
      gridColumn={APP_GRID_COLUMN}
      flexDir="column"
    >
      <FeedbacksTable feedbackAddressedGroup={feedbackAddressedGroup} />
    </Stack>
  )
}
