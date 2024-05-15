import React from 'react'

import { Carousel as AntdCarousel } from 'antd'

import { Image } from '@edw/next-drupal/molecules'

type DrupalParagraph = {
  field_paragraphs: {
    field_description: {
      value: string
    }
    field_media: any
  }[]
}

const Carousel: React.FC<{ paragraph: DrupalParagraph }> = ({ paragraph }) => {
  const slides = paragraph.field_paragraphs ?? []

  return (
    <AntdCarousel className="carousel-paragraph full-width" autoplay>
      {slides.map((slide, index) => (
        <div key={index} className="carousel-slide">
          <Image
            imageStyle={'slide'}
            media={slide.field_media}
            sizes="100vw"
            priority
          />
          <div
            className="carousel-content"
            dangerouslySetInnerHTML={{ __html: slide.field_description.value }}
          />
        </div>
      ))}
    </AntdCarousel>
  )
}

export default Carousel
