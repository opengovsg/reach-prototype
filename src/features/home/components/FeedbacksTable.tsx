import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Heading,
  Card,
  CardHeader,
  CardBody,
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
    <Card>
      <CardHeader>
        <Heading size="lg">Feedbacks to be addressed</Heading>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead bg={'blue.100'}>
              <Tr>
                <Th color={'blue.400'}>Subject</Th>
                <Th color={'blue.400'}>Feedback Detail</Th>
                <Th color={'blue.400'}>Forward to Agency</Th>
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
      </CardBody>
    </Card>
  )
}
