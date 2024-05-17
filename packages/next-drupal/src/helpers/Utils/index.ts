const timer: Record<string, any> = {}

export function debounce(func: any, wait: number = 300, id?: string) {
  if (typeof func !== 'function') return
  const name = id || func.name || 'generic'
  if (timer[name]) clearTimeout(timer[name])
  timer[name] = setTimeout(func, wait)
}

export function stringToHash(string: string) {
  let hash = 0

  if (string.length == 0) return hash

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return hash
}

export const kebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

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

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

export * from './search-utils'
