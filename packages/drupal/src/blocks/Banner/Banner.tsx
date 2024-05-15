import React from 'react'

import { Col, Flex, Row } from 'antd'

import {
  BreadcrumbNavigation,
  Container,
  createBaseUrl,
  parseAndTransformRichText,
  useAppState,
} from '@edw/base'
import { Image, type ParagraphWithImageMedia } from '@edw/drupal'

import './Banner.scss'

type Props = {
  node?: any
  paragraph?: {
    field_banner_variations:
      | 'variation_home'
      | 'variation1'
      | 'variation2'
      | 'variation3'
      | 'variation4'
    field_description?: { processed?: string }
    field_link?: { title?: string; uri?: string }
  } & ParagraphWithImageMedia
}

const field_variations_mapping = {
  default: 'default-light',
  variation_home: 'default-light',
  variation1: 'default-light',
  variation2: 'default-dark',
  variation3: 'landing-page-light',
  variation4: 'landing-page-dark',
}

const Banner: React.FC<Props> = ({ paragraph }) => {
  const appState = useAppState()
  const { breadcrumb } = appState

  const {
    field_banner_variations = 'default',
    field_link: link = {},
    field_media,
    field_title: title = '',
  } = paragraph || {}

  const imageUrl =
    field_media?.field_media_image?.image_style_uri?.hero_banner ??
    createBaseUrl(field_media?.field_media_image?.uri?.url)

  const description = paragraph?.field_description?.processed
    ? paragraph.field_description.processed
    : ''

  const descriptionTransformed = parseAndTransformRichText(description)

  return (
    <div
      className={`banner banner--${
        field_variations_mapping[field_banner_variations]
      } ${imageUrl ? 'has-background-image' : ''} full-width`}
    >
      {imageUrl && (
        <div className="banner__image">
          <Image
            media={field_media}
            sizes="100vw"
            imageStyle={
              field_banner_variations !== 'variation_home'
                ? 'hero_banner'
                : undefined
            }
            priority
          />
        </div>
      )}
      <Container>
        <Row align="bottom">
          <Col span={24}>
            {breadcrumb && (
              <div className="banner__top">
                <Flex justify="space-between">
                  <BreadcrumbNavigation breadcrumb={breadcrumb} />
                </Flex>
              </div>
            )}
            <div className="banner__content">
              {title && <h1>{title}</h1>}
              {description && (
                <div className="banner-description-container">
                  {descriptionTransformed}
                </div>
              )}
              {link?.uri && link?.title && (
                <a className="banner__link" href={link.uri}>
                  {link.title}
                </a>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Banner
