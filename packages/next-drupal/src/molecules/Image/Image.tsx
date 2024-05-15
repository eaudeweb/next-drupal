import { ImageDrupalMedia } from '@edw/next-drupal/@types'

import React from 'react'

import { createImageURL } from '@edw/next-drupal/helpers'
import {
  OptimizedImage,
  OptimizedImageProps,
} from '@edw/next-drupal/molecules/OptimizedImage/OptimizedImage'

interface ImageProps extends Omit<OptimizedImageProps, 'alt' | 'src'> {
  alt?: string
  height?: number
  imageStyle?: string
  media?: ImageDrupalMedia
  width?: number
}

export const Image: React.FC<ImageProps> = ({
  height,
  imageStyle = 'full',
  media,
  width,
  ...props
}): React.ReactElement | null => {
  const srcPath =
    imageStyle && media?.field_media_image?.image_style_uri?.[imageStyle]
      ? `field_media_image.image_style_uri.${imageStyle}`
      : 'field_media_image.uri.url'
  const changedPath = 'field_media_image.changed'

  const imageUrl = createImageURL(media, { changedPath, srcPath })

  const imageAlt = media?.field_media_image?.resourceIdObjMeta?.alt || 'alt'

  const sourceHeight =
    media?.field_media_image?.resourceIdObjMeta?.height ?? 400

  const sourceWidth = media?.field_media_image?.resourceIdObjMeta?.width ?? 768

  const sourceAspectRatio = sourceWidth / sourceHeight

  if (width && width > sourceWidth) width = sourceWidth
  if (height && height > sourceHeight) height = sourceHeight

  const defaultWidth =
    height && !width ? height * sourceAspectRatio : sourceWidth
  const defaultHeight =
    width && !height ? width / sourceAspectRatio : sourceHeight

  return imageUrl ? (
    <OptimizedImage
      alt={imageAlt}
      height={height || defaultHeight}
      quality={100}
      src={imageUrl}
      width={width || defaultWidth}
      {...props}
    />
  ) : null
}

export default Image
