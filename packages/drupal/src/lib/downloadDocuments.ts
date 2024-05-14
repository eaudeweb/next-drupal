import { createBaseURL } from '@edw/base'

export const downloadDocuments = (
  ids: string[],
  format: string[],
  language: string[],
): void => {
  const queryParams = new URLSearchParams({
    format: format.join(','),
    ids: ids.join(','),
    language: language.join(','),
  }).toString()

  const url = createBaseURL(`/download/documents?${queryParams}`)

  if (url) {
    window.open(url, '_blank')
  }
}
