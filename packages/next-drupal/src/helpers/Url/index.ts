import { PropertyPath, get } from 'lodash'
import { DrupalNode } from 'next-drupal'

export const getAbsoluteURL = (input: string): string => {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}

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

export const nodeToPath = (node: DrupalNode): string => {
  const { path } = node
  const id = node.drupal_internal__nid
  return path?.alias ?? `/node/${id}`
}

export const removeDrupalLinkPrefixes = (input: string): string => {
  const prefixes = ['internal:', 'entity:', 'base:']
  for (const prefix of prefixes) {
    if (input.startsWith(prefix)) {
      return input.slice(prefix.length)
    }
  }
  return input
}

export const isFileDownloadUrl = (url: string): boolean => {
  // check if the URL ends with a dot followed by a file extension
  const regex = /\.\w+$/
  return regex.test(url)
}

export const isInternalUrl = (url: string): boolean => {
  return !/^(https?:\/\/|www\.)/.test(url)
}
