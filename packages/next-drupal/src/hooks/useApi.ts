// @todo: add typescript types
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

const defaultHeaders: { [key: string]: { [key: string]: any } } = {
  common: {
    Accept: 'application/json',
  },
  del: {},
  get: {},
  patch: {
    'Content-Type': 'application/json',
  },
  post: {
    'Content-Type': 'application/json',
  },
  put: {
    'Content-Type': 'application/json',
  },
}

export function useApi(
  path: string,
  opts?: { manualTrigger?: boolean } & RequestInit,
  deps?: DependencyList,
) {
  const [state, setState] = useState<any>({
    data: null,
    error: null,
    loaded: false,
    loading: false,
  })

  const getData = useCallback(
    async (opts?: RequestInit) => {
      setState((state) => ({ ...state, loaded: false, loading: true }))

      const method = opts?.method || 'GET'
      let result: any = null

      const response = await fetch(path, {
        ...(opts || {}),
        headers: {
          ...defaultHeaders.common,
          ...defaultHeaders[method.toLowerCase()],
          ...(opts?.headers || {}),
        },
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

  const value = useMemo(() => ({ ...state, getData }), [state, getData])

  useEffect(() => {
    if (opts?.manualTrigger) return
    getData(opts)
  }, [getData, opts, deps])

  return value
}
