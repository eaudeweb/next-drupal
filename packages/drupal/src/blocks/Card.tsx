import React from 'react'

import { createBaseUrl, removeDrupalLinkPrefixes } from '@edw/base'
import { Image, ParagraphWithImageMedia, RichText, Teaser } from '@edw/drupal'

interface CardProps {
  paragraph?: {
    field_body?: {
      processed?: string
    }
    field_link?: {
      uri?: string
    }
    field_meta?: string[]
  } & ParagraphWithImageMedia
}

const Card: React.FC<CardProps> = ({ paragraph }) => {
  if (!paragraph) {
    return null
  }

  const {
    field_body: { processed = '' } = {},
    field_link: link,
    field_media: media,
    field_title: title,
  } = paragraph

  const imgUrl = createBaseUrl(media?.field_media_image?.uri?.url)

  const originalUri = link?.uri

  const uri = originalUri ? removeDrupalLinkPrefixes(originalUri) : ''

  return (
    <Teaser
      className={'is-card'}
      href={uri}
      imageRight={imgUrl && <Image height={130} media={media} width={220} />}
      title={title}
      description={
        <RichText
          paragraph={{ field_body: { value: processed } }}
          stripLinks={uri !== ''}
        ></RichText>
      }
    ></Teaser>
  )
}

export default Card
