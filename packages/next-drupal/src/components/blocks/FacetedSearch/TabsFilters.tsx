import React from 'react'

import { ButtonProps as AntdButtonProps, Button } from 'antd'
import classNames from 'classnames'

interface TabFilterValue {
  active: boolean
  count: number
  label: string
  value: string
}

interface TabOption {
  url: string
  values: TabFilterValue
}

interface TabsFiltersProps {
  ButtonOptionProps?: AntdButtonProps
  id: string
  onChange: (id: string, value: string) => void
  options: TabOption[]
  value: string[]
}

const TabsFilters: React.FC<TabsFiltersProps> = ({
  id,
  ButtonOptionProps = {},
  onChange,
  options,
  value,
}) => {
  return (
    <div className="search-tabs-filters">
      <Button
        className={classNames({
          active: value.length === 0,
        })}
        shape="round"
        onClick={() => onChange(id, '')}
        {...ButtonOptionProps}
      >
        Show All
      </Button>
      {options.map((option) => (
        <Button
          key={option.values.value}
          className={classNames({
            active: value.includes(option.values.value),
          })}
          shape="round"
          onClick={() => onChange(id, option.values.value)}
          {...ButtonOptionProps}
        >
          {`${option.values.label} (${option.values.count})`}
        </Button>
      ))}
    </div>
  )
}

export default TabsFilters
