import { PropertyPath, get } from 'lodash'

export const createBaseURL = (
  relativePath: string | undefined,
): null | string => {
  if (!relativePath) return null

  const isAbsolute = /^(https?:\/\/)/.test(relativePath)
  if (isAbsolute) {
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
