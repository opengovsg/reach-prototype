import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Heading,
} from '@chakra-ui/react'
import { Feedback } from './Feedback'

type FeedbacksTableProps = {
  feedbacks: {
    id: string
    subject: string
    feedbackDetail: string
  }[]
}

export const FeedbacksTable = ({
  feedbacks,
}: FeedbacksTableProps): JSX.Element => {
  return (
    <>
      <Heading as="h3" size="lg">
        {'Feedbacks to be addressed'}
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Subject</Th>
              <Th>Feedback Detail</Th>
              <Th>Forward to Agency</Th>
            </Tr>
          </Thead>
          <Tbody>
            {feedbacks.map((feedback) => (
              <Feedback
                key={feedback.id}
                id={feedback.id}
                subject={feedback.subject}
                feedbackDetail={feedback.feedbackDetail}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
