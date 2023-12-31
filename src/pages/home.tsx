import { Flex } from '@chakra-ui/react'
import Suspense from '~/components/Suspense'
import { APP_GRID_TEMPLATE_COLUMN } from '~/constants/layouts'
import { FeedbacksList } from '~/features/home/components'
import { type NextPageWithLayout } from '~/lib/types'
import { AppGrid } from '~/templates/AppGrid'
import { AdminLayout } from '~/templates/layouts/AdminLayout'

const Home: NextPageWithLayout = () => {
  return (
    <Flex w="100%" flexDir="column">
      <AppGrid
        flex={1}
        bg="white"
        pb="2.5rem"
        templateColumns={APP_GRID_TEMPLATE_COLUMN}
        px={{ base: '1rem', lg: 0 }}
      >
        <Suspense>
          <FeedbacksList />
        </Suspense>
      </AppGrid>
    </Flex>
  )
}

Home.getLayout = AdminLayout

export default Home
