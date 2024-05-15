import type { DrupalNode } from 'next-drupal'

import { useQuery } from '@tanstack/react-query'

import { deserialize } from '../lib/drupal'

// TODO: to be set into config
const baseApiPath = '/api/drupal-taxonomy-term'

export const useTermLabel = (
  taxonomy: string,
  value: string,
  fallback: string,
): string | undefined => {
  const { data } = useQuery({
    queryFn: async () => {
      if (!value) return {}

      const serializedQuery = JSON.stringify({ term: value })
      const res = await fetch(`${baseApiPath}/${taxonomy}`, {
        body: serializedQuery,
        method: 'POST',
      })

      const json = await res.json()
      const data = deserialize(json)
      if (!data || data.length === 0) return

      const term = data.find(
        (t: DrupalNode) => t.drupal_internal__tid === parseInt(value),
      )
      return { label: term.name }
    },
    queryKey: [taxonomy, value],
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return data?.label || fallback
}
