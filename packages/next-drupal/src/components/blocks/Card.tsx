import { ParagraphWithImageMedia } from '@edw/next-drupal/@types'

import React from 'react'

import {
  createBaseURL,
  removeDrupalLinkPrefixes,
} from '@edw/next-drupal/helpers'
import { Image, Teaser } from '@edw/next-drupal/molecules'

import RichText from './RichText/RichText'

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

  const imgUrl = createBaseURL(media?.field_media_image?.uri?.url)

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
