import React from 'react'

import toggles from 'classnames'
import { DrupalNode } from 'next-drupal'

import { Image, type ParagraphWithImageMedia } from '@edw/drupal'

import './ImageParagraph.scss'

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  height?: number
  imageStyle?: string
  node?: DrupalNode
  paragraph?: { field_sticky_to_margin?: boolean } & ParagraphWithImageMedia
  priority?: boolean | undefined
  sizes?: string
  width?: number
}

const ImageParagraph: React.FC<Props> = ({
  className = '',
  height,
  imageStyle,
  paragraph,
  width = 920,
  ...props
}) => {
  if (!paragraph || !paragraph?.field_media?.field_media_image?.uri?.url) {
    return null
  }

  const stickToMargin = paragraph?.field_sticky_to_margin

  const imageCaption = paragraph.field_media?.field_image_caption

  const { node, ...imageProps } = props // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <figure
      className={toggles({
        [className]: className,
        'image-paragraph-content': true,
      })}
    >
      <Image
        className={stickToMargin ? 'img--stick-to-margin' : ''}
        height={height}
        imageStyle={imageStyle}
        media={paragraph?.field_media}
        width={width}
        {...imageProps}
      />

      {imageCaption && <figcaption className="h9">{imageCaption}</figcaption>}
    </figure>
  )
}

export default ImageParagraph
