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

export function useDrupalApi(
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

  const api = useCallback(
    async (opts?: FetchOptions) => {
      if (!drupal) return

      setState((state) => ({ ...state, loaded: false, loading: true }))

      const url = drupal.buildUrl(path)

      let result: any = null
      const response = await drupal.fetch(url.toString(), {
        ...(opts || {}),
      })

      try {
        result = await response.json()
      } catch (error) {
        result = {
          message: response.statusText,
        }
      }

      if (!response.ok) {
        setState((state) => ({
          ...state,
          data: null,
          error: result,
          loaded: false,
          loading: false,
        }))
        return
      }

      setState((state) => ({
        ...state,
        data: result,
        error: null,
        loaded: true,
        loading: false,
      }))
    },
    [path],
  )

  const value = useMemo(() => ({ ...state, api }), [state, api])

  useEffect(() => {
    if (opts?.manualTrigger) return
    api(opts)
  }, [api, opts, deps])

  return value
}
