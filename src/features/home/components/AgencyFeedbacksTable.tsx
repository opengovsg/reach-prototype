import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'

type FeedbacksTableProps = {
  feedbackAddressedGroup: { [key: string]: number }
}

export const AgencyFeedbacksTable = ({
  feedbackAddressedGroup,
}: FeedbacksTableProps): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <Heading size="lg">Feedbacks grouped by agency</Heading>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead bg={'blue.100'}>
              <Tr>
                <Th color={'blue.400'}>Agency</Th>
                <Th isNumeric color={'blue.400'}>
                  Count
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(feedbackAddressedGroup).map(([agency, count]) => (
                <Tr key={agency}>
                  <Td>{agency}</Td>
                  <Td isNumeric>{count}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}
