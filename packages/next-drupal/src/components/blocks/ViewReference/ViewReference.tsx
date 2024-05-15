import React, { useEffect, useState } from 'react'

import { Skeleton } from 'antd'
import classnames from 'classnames'
import { DrupalNode } from 'next-drupal'

import config from '@edw/next-drupal/config'

import { getViewContent } from '@edw/next-drupal/lib/drupal/view'

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

interface FetchContentParams {
  currentPage: number
  hasPaginatedListing: boolean
  node: DrupalNode
  paramsConfig: ParamsConfig
  setIsLoading: (loading: boolean) => void
  setViewContent: (content: any) => void
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

const fetchViewContentAsync = async ({
  currentPage,
  hasPaginatedListing,
  node,
  paramsConfig,
  setIsLoading,
  setViewContent,
  viewId,
}: FetchContentParams): Promise<void> => {
  setIsLoading(true)
  const options = constructOptions(paramsConfig, node)
  const paginationOptions: any = {
    ...options,
    params: { ...options.params, page: currentPage - 1 },
  }

  try {
    const content = await getViewContent(
      viewId,
      hasPaginatedListing ? paginationOptions : options,
    )
    setViewContent(content)
  } catch (error) {
    console.error('Error fetching view content:', error)
  } finally {
    setIsLoading(false)
  }
}

const ViewReference: React.FC<ViewReferenceProps> = ({ node, paragraph }) => {
  const { field_title, field_view, type } = paragraph || {}
  const viewTargetId = field_view?.resourceIdObjMeta?.drupal_internal__target_id
  const viewDisplayId = field_view?.resourceIdObjMeta?.display_id
  const viewId =
    viewTargetId && viewDisplayId ? `${viewTargetId}--${viewDisplayId}` : ''

  const [viewContent, setViewContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)

  const hasPaginatedListing =
    config?.drupal?.paragraphs?.[type]?.templates?.[viewId]?.isPaginatedListing
  const paramsConfig =
    config?.drupal?.paragraphs?.[type]?.templates?.[viewId]?.params

  useEffect(() => {
    if (!viewId) return
    fetchViewContentAsync({
      currentPage,
      hasPaginatedListing,
      node,
      paramsConfig,
      setIsLoading,
      setViewContent,
      viewId,
    })
  }, [viewId, node, paramsConfig, currentPage, hasPaginatedListing])

  if (!viewId) return <p>View parameters not set</p>
  if (isLoading) return <Skeleton paragraph={{ rows: 8 }} active />
  if (!viewContent) return <p>There is no content for this view id: {viewId}</p>

  const ViewComponent =
    config?.drupal?.paragraphs?.[type]?.templates?.[viewId]?.view

  if (!ViewComponent) return <p>There is no reference view for id: {viewId}</p>

  return (
    <>
      {field_title && (
        <h4
          className={classnames({
            [`view-reference__title--${viewId}`]: viewId,
            'view-reference__title': true,
          })}
        >
          {field_title}
        </h4>
      )}
      <ViewComponent
        currentPage={currentPage}
        node={node}
        setPage={setCurrentPage}
        type={type}
        view={viewContent}
      />
    </>
  )
}

export default ViewReference
