import type { AccessToken } from 'next-drupal'

export function formatDate(
  input: string,
  format: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  timeFormat?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(input)
  const dateString = date.toLocaleDateString('en-US', format)

  if (timeFormat) {
    const timeString = date
      .toLocaleTimeString('en-US', timeFormat)
      .toLowerCase()
    return `${dateString} ${timeString}`
  } else {
    return dateString
  }
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

export function absoluteUrl(input: string): string {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}

type Headers = {
  Authorization?: string
  'Content-Type'?: string
} & RequestInit['headers']

// copy from next-drupal, because it's not exported from there
export async function buildHeaders({
  accessToken,
  headers = {
    'Content-Type': 'application/json',
  },
}: {
  accessToken?: AccessToken
  headers?: Headers
} = {}): Promise<RequestInit['headers']> {
  // This allows an access_token (preferrably long-lived) to be set directly on the env.
  // This reduces the number of OAuth call to the Drupal server.
  // Intentionally marked as unstable for now.
  if (process.env.UNSTABLE_DRUPAL_ACCESS_TOKEN) {
    headers['Authorization'] =
      `Bearer ${process.env.UNSTABLE_DRUPAL_ACCESS_TOKEN}`

    return headers
  }

  const token = accessToken // this was changed from next-drupa: `|| (await getAccessToken())`
  if (token) {
    headers.Authorization = `Bearer ${token.access_token}`
  }

  return headers
}

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<F>): void {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
