import React from 'react'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { notification } from 'antd'
import { type DrupalNode, deserialize } from 'next-drupal'
import { stringify } from 'querystring'

import config from '@edw/next-drupal/config'

const initialData = {
  data: [],
  items: [],
  jsonapi: {},
  meta: {
    count: 0,
    facets: [],
  },
}

const fetchItems = async (itemUrls: string[][]) => {
  const responses = Object.assign(
    {},
    ...(await Promise.all(
      itemUrls.map(async ([id, url]) => {
        const resp = await fetch(url)
        const json = await resp.json()
        const body = deserialize(json)
        return { [id]: body }
      }),
    )),
  )
  return responses
}

const getParams = (item: DrupalNode) => {
  const type = item.type
  // TODO: implement view params and summary params
  const defaultOpts = config.drupal.nodeTypes.fetchParams._default
  const params =
    config.drupal.nodeTypes.fetchParams[type]?.summary || defaultOpts.summary

  return params
}

// might not be used anymore
export const useContentItems = (summarizedItems: any[]) => {
  const itemUrls = summarizedItems.map((item) => [
    item.id,
    `${item.links.self.href}&${stringify(getParams(item))}`,
  ])

  const { data, error, isFetching, isPending } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => await fetchItems(itemUrls),
    queryKey: ['fetchContentItems', { itemUrls }],
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const [api] = notification.useNotification()

  React.useEffect(() => {
    if (error) {
      api.error({
        description: `${error}`,
        message: 'Error in fetching results',
        placement: 'bottomRight',
      })
    }
  }, [api, error])

  return { data: data ?? initialData, error, isFetching, isPending }
}
