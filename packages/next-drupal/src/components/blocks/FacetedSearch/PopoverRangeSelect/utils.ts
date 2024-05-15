import type { ButtonType, FilterValue, OptionValue } from './types'

type Option = {
  label: string
  value: string
}

type OptionsMapping = {
  [key: string]: string
}

export const getButtonType = (
  index: number,
  sortedOptions: string[],
  value: FilterValue,
  halfSelected: OptionValue,
): ButtonType => {
  const start = value?.[0]
  const end = value?.[1] ?? start ?? ''

  if (typeof start === 'undefined') {
    return 'default'
  }

  const startIndex = Math.min(
    sortedOptions.indexOf(start),
    sortedOptions.indexOf(end),
  )
  const endIndex = Math.max(
    sortedOptions.indexOf(start),
    sortedOptions.indexOf(end),
  )
  const halfSelectedIndex = sortedOptions.indexOf(halfSelected ?? start)

  let res: ButtonType = 'default'
  if (index === startIndex) {
    res = 'edge'
  } else if (index > startIndex && index < endIndex) {
    res = 'innerSelected'
  } else if (
    (index > startIndex && index <= halfSelectedIndex) ||
    (index >= halfSelectedIndex && index < startIndex)
  ) {
    res = 'halfSelected'
  } else if (index === endIndex) {
    res = 'edge'
  }
  return res
}

export const getOrdinalNumberLabel = (number: number | string) => {
  number = typeof number == 'string' ? parseInt(number) : number
  if (isNaN(number)) return ''

  const lastDigit = number % 10
  const secondToLastDigit = Math.floor((number % 100) / 10)

  let ordinalSuffix = 'th'

  if (secondToLastDigit !== 1) {
    switch (lastDigit) {
      case 1:
        ordinalSuffix = 'st'
        break
      case 2:
        ordinalSuffix = 'nd'
        break
      case 3:
        ordinalSuffix = 'rd'
        break
    }
  }

  return number + ordinalSuffix
}

export const getLabel = (
  options: Option[],
  start: OptionValue,
  end: OptionValue = undefined,
  showSuffix: boolean = false,
  id: string | undefined = undefined,
  showId: boolean = false,
): string => {
  const valueToLabels: OptionsMapping = options.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.value]: cur.label,
    }),
    {},
  )

  const startLabel = start ? valueToLabels[start] ?? start : ''
  const endLabel = end ? valueToLabels[end] ?? end : ''

  const formattedStartLabel = showSuffix
    ? getOrdinalNumberLabel(startLabel)
    : startLabel
  const formattedEndLabel = showSuffix
    ? getOrdinalNumberLabel(endLabel) || formattedStartLabel
    : endLabel || formattedStartLabel

  if (endLabel !== '') {
    return `${formattedStartLabel} - ${formattedEndLabel} ${showId ? id : ''}`
  } else {
    return formattedEndLabel === formattedStartLabel
      ? formattedStartLabel
      : `${formattedStartLabel} - ${formattedEndLabel}`
  }
}

export const parseFilterValue = (filterValue: any): FilterValue => {
  let values = filterValue?.condition?.value
    ? filterValue?.condition?.value
    : filterValue

  if (!values) {
    return []
  }

  if (!Array.isArray(values)) {
    values = Object.values(values)
  }

  const firstValue = values.length > 0 ? (values[0] as OptionValue) : undefined
  const lastValue =
    values.length > 1 ? (values[values.length - 1] as OptionValue) : undefined

  return [firstValue, lastValue]
}
