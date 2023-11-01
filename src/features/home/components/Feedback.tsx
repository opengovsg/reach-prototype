import { Tr, Td } from '@chakra-ui/react'
import { AgencySelect } from './AgencySelect'
import { trpc } from '~/utils/trpc'
type FeedbackProps = {
  id: string
  subject: string
  feedbackDetail: string
}
export const Feedback = ({
  id,
  subject,
  feedbackDetail,
}: FeedbackProps): JSX.Element => {
  const utils = trpc.useContext()
  const updateFeedbackMutation = trpc.feedback.updateFeedback.useMutation({
    onSuccess: async () => {
      await utils.feedback.invalidate()
    },
  })
  const handleUpdate = (agency: string) => {
    return updateFeedbackMutation.mutate({ id, agency })
  }
  return (
    <Tr key={id}>
      <Td>{subject}</Td>
      <Td>{feedbackDetail}</Td>
      <Td>
        <AgencySelect
          onChange={handleUpdate}
          isDisabled={updateFeedbackMutation.isLoading}
        ></AgencySelect>
      </Td>
    </Tr>
  )
}
