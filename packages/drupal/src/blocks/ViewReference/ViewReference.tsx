import React, { useEffect, useState } from 'react'

import { Skeleton } from 'antd'
import toggles from 'classnames'
import { DrupalNode } from 'next-drupal'

import { config } from '@edw/base'
import { getViewContent } from '@edw/drupal'

interface ViewReference {
  node: DrupalNode
  paragraph: any
}

const constructOptions = (paramsConfig: any, node: any) => {
  if (!paramsConfig) return null

  const options: any = { params: {} }

  Object.entries(paramsConfig).forEach(([paramKey, paramValues]: any) => {
    // handling for 'views-argument' matching from node
    if (paramKey === 'views-argument' && Array.isArray(paramValues)) {
      options.params[paramKey] = paramValues.map((paramValue) => {
        return paramValue
          .split('.')
          .reduce((acc: any, key: any) => acc[key], node)
      })
    } else {
      // include other params without processing
      options.params[paramKey] = paramValues
    }
  })

  return options
}

const ViewReference: React.FC<ViewReference> = ({ node, paragraph }) => {
  const { field_title, field_view, type } = paragraph || {}
  const viewTargetId = field_view?.resourceIdObjMeta?.drupal_internal__target_id
  const viewDisplayId = field_view?.resourceIdObjMeta?.display_id
  const viewId =
    viewTargetId && viewDisplayId ? `${viewTargetId}--${viewDisplayId}` : ''
  const [viewContent, setViewContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const paramsConfig =
    config?.drupal?.paragraphs?.[type]?.templates?.[viewId]?.params

  useEffect(() => {
    const fetchViewContent = async () => {
      if (!viewId) return

      setIsLoading(true)
      try {
        const options = constructOptions(paramsConfig, node) || {}

        const content = await getViewContent(viewId, options)
        setViewContent(content)
      } catch (error) {
        console.error('Error fetching view content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchViewContent()
  }, [viewId, node, paramsConfig])

  if (!viewId) return <p>View parameters not set</p>
  if (isLoading) return <Skeleton paragraph={{ rows: 8 }} active />
  if (!viewContent) return <p>There is no content for this view id: {viewId}</p>

  const ViewComponent =
    config?.drupal?.paragraphs?.[type]?.templates?.[viewId]?.view

  if (!ViewComponent) return <p>There is no view for id: {viewId}</p>

  return (
    <>
      {field_title && (
        <h4
          className={toggles({
            [`view-reference__title--${viewId}`]: viewId,
            'view-reference__title': true,
          })}
        >
          {field_title}
        </h4>
      )}
      <ViewComponent node={node} type={type} view={viewContent} />
    </>
  )
}

export default ViewReference
