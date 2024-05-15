import type { AutoCompleteData, AutoCompleteResults } from '../types'

import { useQuery } from '@tanstack/react-query'

// TODO: to be set into config
const baseApiPath = '/api/drupal-search-autocomplete'

export const useAutoComplete = (
  searchIndex: string,
  searchTerm: string | undefined,
): AutoCompleteData => {
  const { data, error, isFetching, isPending } = useQuery({
    queryFn: async () => {
      if (!searchTerm) return {}

      const serializedQuery = JSON.stringify({ text: searchTerm })
      const res = await fetch(`${baseApiPath}/${searchIndex}`, {
        body: serializedQuery,
        method: 'POST',
      })

      if (!res.ok) {
        const errorData = await res.json() // Assuming the server sends JSON with error details
        if (res.status === 400) {
          // Handle specific 400 error here
          console.error('400 Bad Request', errorData)
          throw new Error('Bad Request: ' + errorData.message)
        } else {
          // Handle other non-OK responses here
          throw new Error('Error: ' + res.status)
        }
      }

      const json = await res.json()

      return json as AutoCompleteResults
    },
    queryKey: [searchIndex, searchTerm],
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return { data: data ?? {}, error, isFetching, isPending }
}
