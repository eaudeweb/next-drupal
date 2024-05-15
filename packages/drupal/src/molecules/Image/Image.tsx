import type { ImageDrupalMedia } from '@edw/drupal'

import React from 'react'

import {
  OptimizedImage,
  type OptimizedImageProps,
  createBaseUrl,
} from '@edw/base'

interface ImageProps extends Omit<OptimizedImageProps, 'alt' | 'src'> {
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
  const imageUrl =
    imageStyle && media?.field_media_image?.image_style_uri?.[imageStyle]
      ? media?.field_media_image?.image_style_uri?.[imageStyle]
      : createBaseUrl(media?.field_media_image?.uri?.url)

  if (!imageUrl) return null

  const imageAlt = media?.field_media_image?.resourceIdObjMeta?.alt
    ? media?.field_media_image?.resourceIdObjMeta?.alt
    : 'alt'

  const sourceHeight = media?.field_media_image?.resourceIdObjMeta?.height
    ? media.field_media_image.resourceIdObjMeta.height
    : 400

  const sourceWidth = media?.field_media_image?.resourceIdObjMeta?.width
    ? media.field_media_image.resourceIdObjMeta.width
    : 768

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
