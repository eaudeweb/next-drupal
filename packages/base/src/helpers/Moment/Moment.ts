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

export function formatDate(date: string, format: string): null | string {
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
