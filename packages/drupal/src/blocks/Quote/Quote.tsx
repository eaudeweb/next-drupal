import React from 'react'

import { Teaser } from '@edw/drupal'

import QuoteIcon from './quote.svg'

import './Quote.scss'

interface Props {
  paragraph: {
    field_description?: {
      processed?: string
    }
    field_title?: string
  }
}

const Quote: React.FC<Props> = ({ paragraph }) => {
  const descriptionTransformed = (
    <>
      <h4 className="quote-content">
        {paragraph?.field_description?.processed?.replace(/(<([^>]+)>)/gi, '')}
      </h4>
      <div className="author h9">{paragraph.field_title}</div>
    </>
  )

  return (
    <Teaser
      className="teaser--quote"
      customIcon={<QuoteIcon className="quote-icon" />}
      description={descriptionTransformed}
    ></Teaser>
  )
}

export default Quote
