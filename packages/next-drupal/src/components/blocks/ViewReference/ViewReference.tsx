import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { Skeleton } from 'antd'
import cx from 'classnames'
import { DrupalNode, DrupalView } from 'next-drupal'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import config from '@edw/next-drupal/config'

import { stringToHash } from '@edw/next-drupal/helpers'
import { useDrupalViewApi } from '@edw/next-drupal/hooks'
import { Params } from '@edw/next-drupal/lib/drupal/view'

interface ViewReferenceProps {
  node: DrupalNode
  paragraph: any
}

interface ParamsConfig {
  [key: string]: number | string | string[]
}

interface ViewOptions {
  params?: {
    [key: string]: any
    include?: string | undefined
    page?: number
    'views-argument'?: any
  }
}

export type ViewComponentProps = {
  hashId: string
  node: DrupalNode
  onPageChange: (page: number) => void
  page: number
  pageSize: number
  total: number
  type: string
  view: DrupalView
  viewId: string
}

const constructOptions = (
  paramsConfig: ParamsConfig,
  node: DrupalNode,
): ViewOptions => {
  if (!paramsConfig) return {}

  return {
    params: Object.entries(paramsConfig).reduce(
      (acc, [paramKey, paramValues]) => {
        acc[paramKey] = Array.isArray(paramValues)
          ? paramValues.map((paramValue) =>
              paramValue
                .split('.')
                .reduce((acc: any, key: string) => acc[key], node),
            )
          : paramValues
        return acc
      },
      {} as { [key: string]: any },
    ),
  }
}

const getViewId = (field_view: any): string => {
  if (!field_view?.resourceIdObjMeta) return ''
  const targetId = field_view.resourceIdObjMeta.drupal_internal__target_id
  const displayId = field_view.resourceIdObjMeta.display_id
  return `${targetId}--${displayId}`
}

const ViewReference: React.FC<ViewReferenceProps> = ({ node, paragraph }) => {
  // Refs for scrolling
  const triggerScroll = useRef<boolean>(false)
  const scrollEl = useRef<HTMLDivElement>(null)
  // Get paragraph data
  const { field_title, field_view, type } = paragraph || {}
  // Get router and search params for pagination purposes
  const searchParams = useSearchParams()
  const router = useRouter()
  // Get view id and hash id
  const viewId = useMemo(() => getViewId(field_view), [field_view])
  // Get view config
  const viewConfig = useMemo(
    () => config?.drupal?.paragraphs?.[type]?.templates?.[viewId] || {},
    [type, viewId],
  )
  // Get hash id
  const hashId = useMemo(
    () =>
      viewConfig.uid || paragraph?.drupal_internal__id || stringToHash(viewId),
    [viewConfig, viewId, paragraph],
  )
  // Get page param
  const pageParam = useMemo(() => `page-${hashId}`, [hashId])
  // Get page from search params
  const page = useMemo(
    () => Number(searchParams?.get(pageParam) || 1),
    [searchParams, pageParam],
  )
  // Construct view params
  const params = useMemo(() => {
    const options = constructOptions(viewConfig.params, node)
    if (page && options.params) options.params.page = page - 1
    return options.params as Params
  }, [node, viewConfig, page])
  // Fetch opts
  const opts = useMemo(
    () => ({
      cacheId: `${pageParam}__${page}`,
    }),
    [pageParam, page],
  )
  // Fetch view data
  const { data, error, loading } = useDrupalViewApi(viewId, params, opts)
  // Get page size
  const pageSize = useMemo(() => {
    if (!data) return 0
    const next = data.links?.next
    const prev = data.links?.prev
    if ((!next && !prev) || next) {
      return data.results.length
    }
    if (!next && prev) {
      return (data.meta.count - data.results.length) / (page - 1)
    }
    return viewConfig.pageSize || 5
  }, [data, page, viewConfig])

  // Handle page change
  const onPageChange = useCallback(
    (page: number) => {
      triggerScroll.current = true
      router.push(
        {
          query: {
            ...router.query,
            [`page-${hashId}`]: page.toString(),
          },
        },
        undefined,
        { scroll: false, shallow: true },
      )
    },
    [router, hashId],
  )

  useEffect(() => {
    if (triggerScroll.current && scrollEl.current) {
      const offset = 48 // 3rem
      const top = scrollEl.current.getBoundingClientRect().top
      const scrollY = top + window.scrollY - offset
      window.scrollTo({ behavior: 'smooth', top: scrollY })
      triggerScroll.current = false
    }
  }, [data])

  const ViewComponent =
    config?.drupal?.paragraphs?.[type]?.templates?.[viewId]?.view

  if (!ViewComponent)
    return <p>Error: there is no view component for viewId: {viewId}</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data && loading) return <Skeleton paragraph={{ rows: 8 }} active />

  return (
    <>
      <div className="scroll-target" ref={scrollEl} />
      {field_title && (
        <h4
          className={cx({
            [`view-reference__title--${viewId}`]: viewId,
            'view-reference__title': true,
          })}
        >
          {field_title}
        </h4>
      )}
      {data && (
        <ViewComponent
          hashId={hashId}
          node={node}
          page={page}
          pageSize={pageSize}
          total={data?.meta.count ?? 0}
          type={type}
          view={data}
          viewId={viewId}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

export default ViewReference
