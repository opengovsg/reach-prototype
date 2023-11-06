import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { RestrictedFooter } from '@opengovsg/design-system-react'
import {
  AppPublicHeader,
  LandingSection,
  SectionBodyText,
} from '~/features/landing/components'
import { AppGrid } from '~/templates/AppGrid'

const LandingPage = () => {
  return (
    <>
      <AppPublicHeader />
      <LandingSection
        bg="base.canvas.brand-subtle"
        pt={{ base: '2rem', md: 0 }}
        px={0}
      >
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          spacing={{ base: '1.5rem', md: '3.125rem', lg: '7.5rem' }}
        >
          <Flex flexDir="column" flex={1}>
            <Text
              as="h1"
              textStyle={{
                base: 'responsive-display.heavy',
                md: 'responsive-display.heavy-480',
              }}
              color="base.content.strong"
            >
              Reach prototype.
            </Text>
            <SectionBodyText mt="1rem">
              <Text fontSize={'2xl'}>
                Simple prototype to demonstrate the automatic forwarding of
                citizen feedback
              </Text>
            </SectionBodyText>
          </Flex>
        </Stack>
      </LandingSection>

      <AppGrid bg="base.canvas.brand-subtle" px="1.5rem">
        <Box gridColumn={{ base: '1 / -1', md: '2 / 12' }}>
          <RestrictedFooter
            // This component can only be used if this is an application created by OGP.
            containerProps={{
              px: 0,
            }}
            appName="Reach prototype"
            appLink="/"
          />
        </Box>
      </AppGrid>
    </>
  )
}

export default LandingPage
