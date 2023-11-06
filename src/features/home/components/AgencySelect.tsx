import { SingleSelect } from '@opengovsg/design-system-react'

const agencyNames = [
  { label: 'MOH', value: 'MOH' },
  { label: 'PMO', value: 'PMO' },
  { label: 'MOF', value: 'MOF' },
  { label: 'MCCY', value: 'MCCY' },
  { label: 'MOE', value: 'MOE' },
  { label: 'NEA', value: 'NEA' },
  { label: 'MFA', value: 'MFA' },
  { label: 'MND', value: 'MND' },
  { label: 'MOM', value: 'MOM' },
  { label: 'MOT', value: 'MOT' },
  { label: 'MCI', value: 'MCI' },
]

type AgencySelectProps = {
  onChange: (value: string) => void
  isDisabled: boolean
}

export const AgencySelect = ({
  onChange,
  isDisabled,
}: AgencySelectProps): JSX.Element => {
  return (
    <SingleSelect
      placeholder={'Select Agency'}
      name="agency"
      items={agencyNames}
      onChange={(value) => onChange(value)}
      value=""
      isDisabled={isDisabled}
    />
  )
}
