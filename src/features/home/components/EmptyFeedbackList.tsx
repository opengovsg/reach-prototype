import { Stack, Text } from '@chakra-ui/react'
import { BusStop } from '~/components/Svg'
import { APP_GRID_COLUMN } from '~/constants/layouts'

export const EmptyFeedbackList = (): JSX.Element => {
  return (
    <Stack spacing="2rem" align="center" pt="3rem" gridColumn={APP_GRID_COLUMN}>
      <Text textStyle="subhead-2">There aren&apos;t any feedbacks yet</Text>
      <BusStop />
    </Stack>
  )
}
