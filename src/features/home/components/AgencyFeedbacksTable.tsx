import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
} from '@chakra-ui/react'

type FeedbacksTableProps = {
  feedbackAddressedGroup: { [key: string]: number }
}

export const AgencyFeedbacksTable = ({
  feedbackAddressedGroup,
}: FeedbacksTableProps): JSX.Element => {
  return (
    <>
      <Heading as="h3" size="lg">
        {'Feedbacks addressed count'}
      </Heading>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Agency</Th>
              <Th isNumeric>Count</Th>
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
    </>
  )
}
