import React from 'react'

import { textNodesOnly } from '@edw/next-drupal/helpers'
import { Teaser } from '@edw/next-drupal/molecules'

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
        {textNodesOnly(paragraph?.field_description?.processed || '')}
      </h4>
      <div className="author h9">{paragraph.field_title}</div>
    </>
  )

  return (
    <Teaser
      className="teaser--quote"
      customIcon={<QuoteIcon className="quote-icon" />}
      description={descriptionTransformed}
    />
  )
}

export default Quote
