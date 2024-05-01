import type { SelectFilterView, TermValue } from '../../../types'

import React, { useEffect, useState } from 'react'

import { Button, Flex, Select } from 'antd'

import { useAntdBreakpoints } from '@edw/base'

import './MultiSelectFilter.scss'

const filterOption = (inputValue: string, option: TermValue | undefined) => {
  return typeof option !== 'undefined'
    ? option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    : true
}

function filterZeroCountOptions(options: any[], selectedItems: string[]) {
  const shouldKeepOption = (option: any) => {
    return (
      option.values.count !== 0 || selectedItems.includes(option.values.value)
    )
  }

  return options.filter(shouldKeepOption)
}

const MultiSelectFilter: React.FC<SelectFilterView> = ({
  id,
  disabled = false,
  label,
  onChange,
  options,
  placeholder,
  value,
}) => {
  const [intValues, setIntValues] = useState(value)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setIntValues(value)
  }, [value])

  const filteredOptions =
    options && options.length > 0
      ? filterZeroCountOptions(
          options,
          (intValues as string[] | undefined) ? (intValues as string[]) : [],
        )
      : []

  const selectOptions = filteredOptions.map((opt) => ({
    ...(Array.isArray(opt.values) ? opt.values[0] : opt.values),
    label: `${opt?.values?.label} ${
      opt?.values?.count ? `(${opt.values.count})` : '(0)'
    }`,
    url: opt.url,
  }))

  const initialSelectedValues = (
    Array.isArray(intValues) ? intValues : intValues ? [intValues] : []
  ).map((v) => ({
    key: v,
    label: selectOptions.find((opt) => opt.value === v)?.label || '',
    value: v,
  }))

  const handleChange = React.useCallback(
    (selectedValues: any) => {
      const values = selectedValues.map((v: any) => v.value)
      setIntValues(values)
      if (!dropdownOpen) {
        onChange(id, values)
      }
    },
    [setIntValues, dropdownOpen, onChange, id],
  )

  const handleDropdownStateChange = (open: boolean) => {
    setDropdownOpen(open)
    if (!open) {
      onChange(id, intValues)
    }
  }

  const handleSubmit = () => {
    onChange(id, intValues)
    setDropdownOpen(false)
  }

  const handleCancel = () => {
    setIntValues(value)
    setDropdownOpen(false)
  }

  const breakpoints = useAntdBreakpoints()
  const showMobileDropdown = !breakpoints.lg
  return (
    <div className="multi-select-filter">
      {label}
      <Select
        className="multi-select-filter__select"
        disabled={disabled}
        filterOption={filterOption}
        mode="multiple"
        open={dropdownOpen}
        options={selectOptions}
        placeholder={placeholder}
        popupClassName={`multi-select-filter__dropdown-container ${showMobileDropdown ? 'multi-select-filter__mobile-dropdown-container' : ''}`}
        value={initialSelectedValues}
        virtual={false}
        dropdownRender={(dropdownContent) => {
          return (
            <div>
              {dropdownContent}
              <Flex
                className="multi-select-filter__dropdown-actions-container"
                justify="space-between"
              >
                <Button
                  className="multi-select-filter__dropdown-actions-submit"
                  onClick={handleSubmit}
                >
                  Apply
                </Button>
                <Button
                  className="multi-select-filter__dropdown-actions-cancel"
                  onClick={handleCancel}
                >
                  Close
                </Button>
              </Flex>
            </div>
          )
        }}
        onChange={handleChange}
        onDropdownVisibleChange={(open) => handleDropdownStateChange(open)}
        labelInValue
      />
    </div>
  )
}

export default MultiSelectFilter
