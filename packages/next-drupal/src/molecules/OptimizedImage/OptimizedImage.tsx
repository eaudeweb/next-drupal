import React from 'react'

import Image, { ImageProps } from 'next/image'

export const IMAGE_SIZES = {
  large: {
    height: 720,
    width: 1280,
  },
  logo: {
    height: 48,
    width: 184,
  },
  medium: {
    height: 432,
    width: 768,
  },
  original: {
    height: undefined,
    width: undefined,
  },
  small: {
    height: 180,
    width: 320,
  },
  xlarge: {
    height: 1080,
    width: 1920,
  },
}

export interface OptimizedImageProps extends ImageProps {
  size?: 'large' | 'logo' | 'medium' | 'original' | 'small' | 'xlarge'
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  size = 'original',
  ...props
}) => {
  const imageSize = IMAGE_SIZES[size]

  return <Image {...imageSize} {...props} />
}
