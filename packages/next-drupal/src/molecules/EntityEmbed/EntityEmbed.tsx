import React, { useEffect, useState } from 'react'

import { Skeleton } from 'antd'
import { JsonApiResource } from 'next-drupal'

// @ts-ignore - cyclic dependency
import { drupal } from '../../../../drupal/src/lib/drupal'
import MediaDocument from './templates/MediaDocument'

interface EntityEmbedProps {
  attributes: any
}

const entityMapping: { [key: string]: any } = {
  'media--document': MediaDocument,
}

// @todo: move this in the appropriate config file
const entityFetchParams: { [key: string]: any } = {
  'media--document': {
    include: ['pseudo_files'].join(','),
  },
}

export const EntityEmbed: React.FC<EntityEmbedProps> = ({ attributes }) => {
  const embedButton = attributes['data-embed-button']
  const entityUuid = attributes['data-entity-uuid']
  const entityType = attributes['data-entity-type']

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [entity, setEntity] = useState<JsonApiResource | null>(null)

  const entityIdentifier = entityType + '--' + embedButton

  useEffect(() => {
    const fetchEntity = async () => {
      if (!attributes) return null

      setIsLoading(true)

      try {
        const entity = await drupal.getResource(entityIdentifier, entityUuid, {
          params: entityFetchParams[entityIdentifier],
        })

        setEntity(entity)
      } catch (error) {
        console.error('Failed to fetch:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!entity) return null
  if (isLoading) return <Skeleton paragraph={{ rows: 3 }} active />

  const EntityEmbedElement = entityMapping[entityIdentifier]

  return EntityEmbedElement ? (
    <EntityEmbedElement entity={entity} />
  ) : (
    <div>{entity.name}</div>
  )
}
