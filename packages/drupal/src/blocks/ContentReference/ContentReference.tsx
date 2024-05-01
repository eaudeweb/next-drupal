import React from 'react'

import { Col, Row } from 'antd'

import {
  DrupalLink,
  config,
  removeDrupalLinkPrefixes,
  useAntdBreakpoints,
} from '@edw/base'

import ViewAllArrow from './view-all-arrow.svg'

import './ContentReference.scss'

interface ContentReferenceProps {
  paragraph?: {
    field_entities?: Array<{
      field_country?: { name?: string }
      field_date?: string
      field_date_range?: { end_value?: string; value?: string }
      field_event_city?: string
      field_event_presence?: string
      field_event_venue?: { value?: string }
      field_hide_date?: boolean
      id?: string
      path?: {
        alias?: string
      }
      title?: string
      type?: string
    }>
    field_link: { title?: string; uri?: string }
    field_number_of_columns?: string
    field_title?: string
    id: string
    type: string
  }
}

const ContentReference: React.FC<ContentReferenceProps> = ({ paragraph }) => {
  const { sm } = useAntdBreakpoints()

  if (!paragraph) {
    return null
  }

  const { field_link, field_title } = paragraph || {}

  const entityTemplates = config.drupal.paragraphs[paragraph.type].templates

  const columnsSpan = 24 / parseInt(paragraph.field_number_of_columns || '1')

  const entitiesMap = (paragraph.field_entities || []).map((entity, index) => {
    if (entity?.type) {
      const EntityViewComponent =
        entityTemplates[entity.type]?.view || entityTemplates['default'].view

      return (
        <Col key={index} span={columnsSpan}>
          <EntityViewComponent entity={entity} />
        </Col>
      )
    } else {
      return (
        <Col key={index} span={columnsSpan}>
          No view for this entity type
        </Col>
      )
    }
  })

  const contentReferenceLink = (() => {
    if (!field_link || !field_link.title || !field_link.uri) return false

    return (
      <DrupalLink
        className="view-all-link"
        href={removeDrupalLinkPrefixes(field_link.uri)}
      >
        {field_link?.title} <ViewAllArrow />
      </DrupalLink>
    )
  })()

  return (
    //TODO: this part should be a template(ex: HighlightCard) in app config
    // so content reference can support templating
    <div className="content-reference">
      {field_title || field_link?.uri ? (
        <div className="content-reference__top">
          {field_title && <h2>{field_title}</h2>}
          {sm && contentReferenceLink}
        </div>
      ) : null}
      <Row className="content-reference__content">{entitiesMap}</Row>

      {!sm && contentReferenceLink && (
        <div className="content-reference__bottom">{contentReferenceLink}</div>
      )}
    </div>
  )
}

export default ContentReference
