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
