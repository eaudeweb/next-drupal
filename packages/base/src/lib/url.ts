import { DrupalNode } from 'next-drupal'

export const createImageUrl = (
  relativePath: string | undefined,
): null | string => {
  if (!relativePath) return null
  return process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + relativePath
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
