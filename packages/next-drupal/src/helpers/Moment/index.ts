const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
}

const day = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}

type DayFormat = 'DD' | 'dddd'

type MonthFormat = 'MM' | 'mmmm'

type YearFormat = 'YY' | 'YYYY'

export function formatDay(d: number, format: DayFormat): string {
  if (format === 'DD') {
    return d < 10 ? `0${d}` : `${d}`
  }

  return day[d]
}

export function formatMonth(m: number, format: MonthFormat): string {
  if (format === 'MM') {
    return m < 10 ? `0${m}` : `${m}`
  }

  return months[m]
}

export function formatYear(y: number, format: YearFormat): string {
  if (format === 'YY') {
    return y.toString().slice(-2)
  }

  return y.toString()
}

export function _formatDate(date: string, format: string): null | string {
  try {
    const d = new Date(date)

    return format
      .replace('DD', formatDay(d.getDay(), 'DD'))
      .replace('dddd', formatDay(d.getDay(), 'dddd'))
      .replace('MM', formatMonth(d.getMonth(), 'MM'))
      .replace('mmmm', formatMonth(d.getMonth(), 'mmmm'))
      .replace('YYYY', formatYear(d.getFullYear(), 'YYYY'))
      .replace('YY', formatYear(d.getFullYear(), 'YY'))
  } catch (error) {
    console.error(error)
    return null
  }
}

export function formatDate(
  input: string,
  format: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  timeFormat?: Intl.DateTimeFormatOptions,
  locales?: string,
): string {
  const date = new Date(input)
  const selectedLocales = locales || 'en-US'
  const dateString = date.toLocaleDateString(selectedLocales, format)

  if (timeFormat) {
    const timeString = date
      .toLocaleTimeString(selectedLocales, timeFormat)
      .toLowerCase()
    return `${dateString} ${timeString}`
  } else {
    return dateString
  }
}

export function formatSpecialDate(input: string) {
  const date = new Date(input)
  const day = date.toLocaleDateString('en-US', { day: '2-digit' })
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const year = date.toLocaleDateString('en-US', { year: 'numeric' })

  return `${day} ${month}, ${year}`
}

export function formatDatesAsInterval(startDate: string, endDate: string) {
  if (!startDate) return ''

  const locale = 'en-GB'
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  const formattedStartDate = new Date(startDate)
  const formattedEndDate = new Date(endDate)

  if (!endDate) {
    return formattedStartDate.toLocaleDateString(locale, dateFormatOptions)
  }

  const startDay = formattedStartDate.getDate()
  const endDay = formattedEndDate.getDate()
  const startMonth = formattedStartDate.toLocaleString(locale, {
    month: 'long',
  })
  const endMonth = formattedEndDate.toLocaleString(locale, { month: 'long' })
  const year = formattedStartDate.getFullYear()

  if (
    formattedStartDate.getMonth() === formattedEndDate.getMonth() &&
    formattedStartDate.getFullYear() === formattedEndDate.getFullYear()
  ) {
    if (startDay == endDay) return `${startDay} ${startMonth}, ${year}`
    return `${startDay}-${endDay} ${startMonth}, ${year}`
  }

  if (formattedStartDate.getFullYear() === formattedEndDate.getFullYear()) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`
  }

  return `${formattedStartDate.toLocaleDateString(locale, dateFormatOptions)} - ${formattedEndDate.toLocaleDateString(locale, dateFormatOptions)}`
}

export function getDateBasedStatusLabel(
  startDate: string = '',
  endDate: string = '',
) {
  if (!startDate) return ''
  const currentDate = new Date()

  if (new Date(endDate) < currentDate) return 'Past'

  return new Date(startDate) < currentDate ? 'Ongoing' : 'Upcoming'
}
