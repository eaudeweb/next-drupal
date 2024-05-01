import type { ButtonType } from './types'

import React, { useEffect, useState } from 'react'

import { Button } from 'antd'
import toggles from 'classnames'

import { formatDate } from '@edw/drupal'

import BackArrow from './back-arrow.svg'
import NextArrow from './next-arrow.svg'
import Separator from './separator.svg'
import { getLabel, getOrdinalNumberLabel } from './utils'

type PopoverPaginationContentProps = {
  bProps: any
  getButtonType: (
    index: number,
    sortedOptions: string[],
    selectedValues: [string | undefined, string | undefined],
    halfSelected?: string,
  ) => ButtonType
  handleClick: (value: string) => void
  label?: string
  options: any
  pageSize: number
  selectedValues: [string | undefined, string | undefined]
  showSuffix: boolean
}

const PopoverPaginationContent: React.FC<PopoverPaginationContentProps> = ({
  bProps,
  getButtonType,
  handleClick,
  label,
  options,
  pageSize,
  selectedValues,
  showSuffix,
}) => {
  const isSelected = (optionValue: any) => selectedValues.includes(optionValue)
  const getIndexOfOption = (optionValue: any) =>
    options.findIndex((opt: any) => opt.value === optionValue)
  const isOptionInRange = (index: any) => {
    const startIndex = getIndexOfOption(selectedValues[0])
    const endIndex = getIndexOfOption(selectedValues[1])
    return index >= startIndex && index <= endIndex
  }

  const handleSelect = (value: any) => {
    handleClick(value)
  }
  const totalPages = Math.ceil(options.length / pageSize)

  const [currentPage, setCurrentPage] = useState(totalPages)

  const goToPrevPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
  const goToNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))

  useEffect(() => {
    if (!selectedValues[0] && !selectedValues[1]) {
      setCurrentPage(totalPages)
    }
  }, [selectedValues, totalPages])

  const isPrevDisabled = currentPage === 1
  const isNextDisabled = currentPage === totalPages

  let indexOfFirstItem
  let indexOfLastItem

  if (currentPage === totalPages) {
    indexOfFirstItem = options.length - pageSize
    indexOfLastItem = options.length
  } else {
    indexOfLastItem = options.length - (totalPages - currentPage) * pageSize
    indexOfFirstItem = indexOfLastItem - pageSize
    if (indexOfFirstItem < 0) {
      indexOfFirstItem = 0
    }
    if (indexOfFirstItem && !options[indexOfFirstItem]) {
      indexOfFirstItem = 0
    }
    if (indexOfLastItem && !options[indexOfLastItem]) {
      indexOfLastItem = options.length
    }
  }

  const currentItems = options.slice(indexOfFirstItem, indexOfLastItem)

  const formattedStartLabel = getLabel(
    options,
    selectedValues[0],
    undefined,
    showSuffix,
  )
  const formattedEndLabel = getLabel(
    options,
    selectedValues[1],
    undefined,
    showSuffix,
  )

  const selectedLabel = (
    <>
      <span
        className={toggles({
          active: !formattedStartLabel,
          start: true,
        })}
      >
        {formattedStartLabel || 'From'}
      </span>{' '}
      {<Separator />}{' '}
      <span
        className={toggles({
          active: formattedStartLabel && !formattedEndLabel,
          end: true,
        })}
      >
        {formattedEndLabel || 'To'}
      </span>
    </>
  )

  if (options && options.length === 0) {
    return (
      <div className="popover-pag-container">
        <div className="popover-pag-no-items-container">
          <p>No available options for this selection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="popover-pag-container">
      <div className="popover-pag-header">
        <Button
          className="popover-pag-nav-button"
          disabled={isPrevDisabled}
          shape="circle"
          icon={
            <span>
              <BackArrow />
            </span>
          }
          onClick={goToPrevPage}
        />
        <span>{label}</span>
        <Button
          className="popover-pag-nav-button"
          disabled={isNextDisabled}
          shape="circle"
          icon={
            <span>
              <NextArrow />
            </span>
          }
          onClick={goToNextPage}
        />
      </div>
      <div className="popover-page-selected-label">{selectedLabel}</div>
      <div className="popover-pag-listing-container">
        {currentItems.map((opt: any, index: any) => {
          const btnType = getButtonType(
            index,
            options,
            selectedValues,
            opt.value,
          )
          let buttonProps = {
            ...bProps[btnType],
            className: 'popover-pag-button',
          }

          const overallIndex = options.indexOf(opt)
          if (isSelected(opt.value)) {
            buttonProps = {
              ...buttonProps,
              className: 'popover-pag-button popover-pag-selected',
            }
          } else if (isOptionInRange(overallIndex)) {
            buttonProps = {
              ...buttonProps,
              className: 'popover-pag-button popover-pag-in-range',
            }
          }

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              {...buttonProps}
            >
              <div className="popover-pag-button-content">
                <span className="popover-pag-label">
                  {showSuffix ? getOrdinalNumberLabel(opt.label) : opt.label}
                </span>
                {opt.endDate && (
                  <span className="popover-pag-date">{`${formatDate(
                    opt.endDate,
                    { year: 'numeric' },
                  )}`}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PopoverPaginationContent
