import type { CheckboxFilterProps, Term } from '../../types'

import React from 'react'

import { Checkbox } from 'antd'

function getCheckboxCount(
  checkboxData: Term[] | undefined,
): number | undefined {
  if (!checkboxData) {
    return undefined
  }

  const checkedData = checkboxData.find((item) => item.values.value === '1')

  return checkedData && checkedData?.values?.count
    ? checkedData.values.count
    : undefined
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  id,
  facet,
  label,
  onChange,
  value,
}) => {
  const isChecked = value && value[0] === '1' ? true : false
  const values = facet?.terms ? facet.terms.map((t) => t.values) : []

  const isDisabled =
    !isChecked && (!values || (values.length === 1 && values[0].value === '0'))

  const handleCheckboxChange = () => {
    const newCheckedStatus = !isChecked

    const nextValue = newCheckedStatus ? '1' : '0'

    onChange(id, nextValue === '0' ? '' : [nextValue])
  }

  const facetCount =
    facet?.terms && facet.terms.length > 0 ? getCheckboxCount(facet.terms) : ''

  return (
    <Checkbox
      checked={isChecked}
      disabled={isDisabled}
      onChange={handleCheckboxChange}
    >
      {label} {facetCount ? `(${facetCount})` : '(0)'}
    </Checkbox>
  )
}

export default CheckboxFilter
