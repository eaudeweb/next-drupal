export function formatSpecialDate(input: string) {
  const date = new Date(input)
  const day = date.toLocaleDateString('en-US', { day: '2-digit' })
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const year = date.toLocaleDateString('en-US', { year: 'numeric' })

  return `${day} ${month}, ${year}`
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
