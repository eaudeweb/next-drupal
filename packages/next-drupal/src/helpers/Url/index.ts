import { PropertyPath, get } from 'lodash'

export * from './drupal'

export const isInternalUrl = (url: string): boolean => {
  return !/^(https?:\/\/|www\.)/.test(url)
}

export const getAbsoluteURL = (input: string): string => {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}

export const createBaseURL = (
  relativePath: string | undefined,
): null | string => {
  if (!relativePath) return null

  const isInternal = isInternalUrl(relativePath)
  if (!isInternal) {
    return relativePath
  }

  return process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + relativePath
}

export const createDocButtonURL = (
  url: null | string | undefined,
): string | undefined => {
  if (!url) return ''

  const baseUrl = createBaseURL(url)

  return baseUrl || ''
}

export const createImageURL = (
  data?: Record<string, any>,
  image?: { changedPath: PropertyPath; srcPath: PropertyPath },
) => {
  if (!image || !data) return ''
  const imageSrc = createBaseURL(get(data, image.srcPath)) || ''
  const imageChanged = new Date(get(data, image.changedPath)).getTime()

  if (!imageSrc) return ''
  if (isNaN(imageChanged)) return imageSrc

  return imageSrc.includes('?')
    ? `${imageSrc}&changed=${imageChanged}`
    : `${imageSrc}?changed=${imageChanged}`
}

export const isFileDownloadUrl = (url: string): boolean => {
  // check if the URL ends with a dot followed by a file extension
  const regex = /\.\w+$/
  return regex.test(url)
}
