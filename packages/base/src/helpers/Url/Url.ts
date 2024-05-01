export const createBaseUrl = (
  relativePath: string | undefined,
): null | string => {
  if (!relativePath) return null
  return process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + relativePath
}

export const createDocButtonURL = (
  url: null | string | undefined,
): string | undefined => {
  if (!url) return ''

  const baseUrl = createBaseUrl(url)

  return baseUrl || ''
}
