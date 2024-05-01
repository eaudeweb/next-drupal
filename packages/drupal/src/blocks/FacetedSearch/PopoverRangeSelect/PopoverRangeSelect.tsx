import type { ButtonType, OptionValue } from './types'
import type { FilterItem } from 'drupal-jsonapi-params'
import type { ReactElement } from 'react'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { CloseCircleOutlined } from '@ant-design/icons'
import { Popover } from 'antd'

import { usePrevious } from '@edw/base'

import PopoverPaginationContent from './PaginatedPopoverContent'
import { getButtonType, getLabel, parseFilterValue } from './utils'

import './PopoverRangeSelect.scss'

type Option = {
  label: string
  value: string
}

type PopoverSelectProps = {
  icon: ReactElement
  id: string
  label?: string
  onChange: (id: string, value: unknown) => void
  options: Option[]
  pageSize: number
  placeholder?: string
  resetFilters: () => void
  showLabelTitle: boolean
  showSuffix: boolean
  title: string
  value: FilterItem | undefined
}

type ButtonTypeProps = {
  [K in ButtonType]: any
}

const bProps: ButtonTypeProps = {
  default: {},
  edge: {
    type: 'primary',
  },
  halfSelected: {
    style: {
      backgroundColor: '#EEE',
    },
  },
  innerSelected: {
    style: {
      backgroundColor: '#00AA44EE',
    },
  },
}

const PopoverRangeSelect: React.FC<PopoverSelectProps> = ({
  id,
  icon,
  onChange,
  options,
  placeholder,
  resetFilters,
  showLabelTitle,
  showSuffix,
  title,
  value,
}) => {
  const initialParsedValue = useMemo(
    () => parseFilterValue(value) || [undefined, undefined],
    [value],
  )

  const [start, setStart] = useState<OptionValue>(initialParsedValue[0])
  const [end, setEnd] = useState<OptionValue>(initialParsedValue[1])
  const [open, setOpen] = useState<boolean>(false)
  const sortedOptions: any = useMemo(
    () => options.map((opt) => opt.value),
    [options],
  )

  const prevVal = usePrevious(value)

  useEffect(() => {
    if (prevVal !== value) {
      const newParsedValue = parseFilterValue(value) || [undefined, undefined]
      setStart(newParsedValue[0])
      setEnd(newParsedValue[1])
    }
  }, [prevVal, value])

  const label =
    start ?? end
      ? getLabel(options, start, end, showSuffix, title, showLabelTitle)
      : placeholder

  const handleClick = useCallback(
    (opt: string) => {
      let newStart, newEnd

      if (!start) {
        newStart = opt
        newEnd = undefined
      } else if (start && end) {
        newStart = opt
        newEnd = undefined
      } else {
        newStart = start
        newEnd = opt
      }

      setStart(newStart)
      setEnd(newEnd)

      if (newEnd !== undefined) {
        const newValue = sortedOptions.slice(
          Math.min(
            sortedOptions.indexOf(newStart),
            sortedOptions.indexOf(newEnd),
          ),
          Math.max(
            sortedOptions.indexOf(newStart),
            sortedOptions.indexOf(newEnd),
          ) + 1,
        )
        onChange(id, newValue)
      }

      //if start and end have values, close the popup
      if (newStart && newEnd) {
        setOpen(false)
      }
    },
    [end, start, id, onChange, sortedOptions],
  )

  const triggerOpenChange = (value: boolean) => {
    //when closing and only start is selected, end = start
    if (!value && !end && start) {
      setEnd(start)
      const newValue = [start]
      onChange(id, newValue)
    }

    setOpen(value)
  }

  const handleClear = () => {
    resetFilters()
  }

  return (
    <div className="popover-container">
      <Popover
        open={open}
        trigger={'click'}
        content={
          <PopoverPaginationContent
            bProps={bProps}
            getButtonType={getButtonType}
            handleClick={handleClick}
            label={placeholder}
            options={options}
            pageSize={12}
            selectedValues={[start, end]}
            showSuffix={showSuffix}
          />
        }
        onOpenChange={triggerOpenChange}
      >
        <button className="popover-button-trigger">
          <div className="value-target">
            {icon} <span>{label}</span>
          </div>
        </button>
      </Popover>
      {(start || end) && (
        <span className="popover-button-clear" onClick={handleClear}>
          <CloseCircleOutlined />
        </span>
      )}
    </div>
  )
}

export default PopoverRangeSelect
