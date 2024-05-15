import { ImageDrupalMedia, Paragraph } from '@edw/next-drupal/@types'

import React, { CSSProperties, useCallback } from 'react'

import { Col, Row } from 'antd'
import toggles from 'classnames'
import { DrupalNode } from 'next-drupal'

import { Container } from '@edw/next-drupal/components/ui'
import { useDefaultBreakpoint } from '@edw/next-drupal/hooks'
import { Image, RenderParagraph } from '@edw/next-drupal/molecules'

import './ContainerParagraph.scss'

type Props = {
  id: string
  node?: DrupalNode
  paragraph?: {
    field_background_color?:
      | 'gray'
      | 'primary'
      | 'secondary'
      | 'transparent'
      | 'white'
    field_background_media?: ImageDrupalMedia
    field_container_size?:
      | 'full-width'
      | 'header'
      | 'large'
      | 'medium'
      | 'small'
    field_hide_on_mobile?: boolean
    parent_type: 'node' | 'paragraph'
  } & Paragraph
}

interface ContainerCustomCSS extends CSSProperties {
  '--container-background-color'?: string
}

const field_background_color_mapping = {
  gray: 'var(--ant-color-gray)',
  primary: 'var(--ant-color-primary)',
  secondary: 'var(--ant-color-secondary)',
  transparent: 'transparent',
  white: 'white',
}

const ContainerParagraph: React.FC<Props> = ({ id, node, paragraph }) => {
  const {
    field_background_color = 'transparent',
    field_background_media,
    field_container_size = 'small',
    field_hide_on_mobile = false,
    field_paragraphs = [],
    parent_type = null,
  } = paragraph || {}

  const hasImage = field_background_media?.field_media_image?.uri?.url

  const hasBackground = field_background_color || hasImage
  const hasFullWidth = hasBackground && parent_type === 'node'
  const isInDefaultBreakpoint = useDefaultBreakpoint()

  const isHiddenOnCurrentBreakpoint =
    field_hide_on_mobile && !isInDefaultBreakpoint

  const baseContainer = useCallback(
    (className?: string) => {
      return (
        <Container id={id} className={className} size={field_container_size}>
          <Row>
            {field_paragraphs.map((p: any) => {
              // @todo: this forces only the news content reference to render in alternative style
              const replacingP =
                hasImage && p.type === 'paragraph--edw_content_reference'
                  ? Object.assign({}, p, {
                      field_entities: p.field_entities.map((entity: any) => {
                        return entity.type == 'node--news'
                          ? Object.assign({}, entity, {
                              type: 'node--news--alternative',
                            })
                          : entity
                      }),
                    })
                  : p

              return (
                <Col key={p.id} className="container-paragraph-item" span={24}>
                  <RenderParagraph node={node} paragraph={replacingP} />
                </Col>
              )
            })}
          </Row>
        </Container>
      )
    },
    [field_container_size, field_paragraphs, hasImage, id, node],
  )

  if (!baseContainer() || isHiddenOnCurrentBreakpoint) return <></>

  if (!hasBackground) return baseContainer('container-paragraph')

  return (
    <div
      className={toggles({
        [`has-background-color container-paragraph--${field_background_color}`]:
          field_background_color,
        'container-paragraph': true,
        'full-width': hasFullWidth,
        'has-background': hasBackground,
        'has-background-image': hasImage,
      })}
      style={
        {
          '--container-background-color':
            field_background_color_mapping[field_background_color],
        } as ContainerCustomCSS
      }
    >
      {hasImage && (
        <div className="container-paragraph__image">
          <Image media={field_background_media} sizes="100vw" priority />
        </div>
      )}
      {baseContainer()}
    </div>
  )
}

export default ContainerParagraph
