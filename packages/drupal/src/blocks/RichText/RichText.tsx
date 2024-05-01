import React from 'react'

import { parseAndTransformRichText } from '@edw/base'

import './RichText.scss'

interface Props {
  paragraph?: {
    field_body?: {
      value?: string
    }
  }
  stripLinks?: boolean
}

const RichText: React.FC<Props> = ({ paragraph, stripLinks = false }) => {
  if (!paragraph || !paragraph.field_body || !paragraph.field_body.value) {
    return null
  }
  const content = parseAndTransformRichText(
    paragraph.field_body.value,
    stripLinks,
  )
  return <div className="rich-text-content">{content}</div>
}

export default RichText
