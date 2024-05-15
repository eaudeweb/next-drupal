import React from 'react'

import { Flex, Select } from 'antd'
const { Option } = Select

interface SingleSelectFilterProps {
  disabled?: boolean
  id: string
  label: string
  onChange: (id: string, value: unknown) => void
  options: string[][]
  value: string | undefined
}

const SingleSelectFilter: React.FC<SingleSelectFilterProps> = ({
  id,
  disabled,
  label,
  onChange,
  options,
  value,
}) => (
  <Flex>
    {label ? <label>{label}</label> : null}
    <Select
      defaultValue={value}
      disabled={disabled}
      placeholder={`Select ${label}`}
      variant="borderless"
      onChange={(value) => onChange(id, value)}
    >
      {options.map(([value, text]) => (
        <Option key={value} value={value}>
          {text}
        </Option>
      ))}
    </Select>
  </Flex>
)

export default SingleSelectFilter
