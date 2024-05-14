// @todo: add typescript types
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { FetchOptions } from 'next-drupal'

import { drupal } from '../lib/drupal'

export default function useDrupalApi(
  path: string,
  opts?: { manualTrigger?: boolean } & FetchOptions,
  deps?: DependencyList,
) {
  const [state, setState] = useState<any>({
    data: null,
    error: null,
    loaded: false,
    loading: false,
  })

  const getData = useCallback(
    async (opts?: FetchOptions) => {
      if (!drupal) return

      setState((state) => ({ ...state, loaded: false, loading: true }))

      const url = drupal.buildUrl(path)

      let data: any = null
      const response = await drupal.fetch(url.toString(), {
        ...(opts || {}),
      })

      try {
        data = await response.json()
      } catch (error) {
        data = {
          message: response.statusText,
        }
      }

      if (!response.ok) {
        setState((state) => ({
          ...state,
          data: null,
          error: data,
          loaded: false,
          loading: false,
        }))
        return
      }

      setState((state) => ({
        ...state,
        data,
        error: null,
        loaded: true,
        loading: false,
      }))
    },
    [path],
  )

  const value = useMemo(() => ({ ...state, getData }), [state, getData])

  useEffect(() => {
    if (opts?.manualTrigger) return
    getData(opts)
  }, [getData, opts, deps])

  return value
}
