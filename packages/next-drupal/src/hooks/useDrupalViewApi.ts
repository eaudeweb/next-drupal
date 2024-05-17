// @todo: add typescript types
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { drupal } from '../lib/drupal'
import { Params, getViewContent } from '../lib/drupal/view'

type Options = {
  cacheId?: string
  manualTrigger?: boolean
}

export function useDrupalViewApi(
  viewId: string,
  params?: Params,
  opts?: Options,
  deps?: DependencyList,
) {
  const cache = useRef<Record<string, any>>({})
  const [state, setState] = useState<any>({
    data: null,
    error: null,
    loaded: false,
    loading: false,
  })

  const getData = useCallback(
    async (params?: Params, opts?: Options) => {
      if (!drupal) return

      setState((state) => ({ ...state, loaded: false, loading: true }))

      let result: any = null
      try {
        const cacheId = opts?.cacheId || ''
        result =
          cache.current[cacheId] || (await getViewContent(viewId, params))
        setState((state) => ({
          ...state,
          data: result,
          error: null,
          loaded: true,
          loading: false,
        }))
        if (opts?.cacheId) {
          cache.current[opts.cacheId] = result
        }
      } catch (error) {
        result = {
          message: error.message,
          statusCode: error.statusCode,
        }
        setState((state) => ({
          ...state,
          data: null,
          error: result,
          loaded: false,
          loading: false,
        }))
      }
    },
    [viewId],
  )

  const value = useMemo(() => ({ ...state, getData }), [state, getData])

  useEffect(() => {
    if (opts?.manualTrigger) return
    getData(params, opts)
  }, [getData, params, opts, deps])

  return value
}
