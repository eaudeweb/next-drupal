import React from 'react'

import { RenderParagraph } from '../../molecules/RenderParagraph'

import './Timeline.scss'

interface TimelineProps {
  paragraph?: {
    field_paragraphs: []
    id: string
    type: string
  }
}

const Timeline: React.FC<TimelineProps> = ({ paragraph }) => {
  if (!paragraph) {
    return null
  }

  const { field_paragraphs } = paragraph

  return (
    <div className="timeline">
      {field_paragraphs?.map((nestedParagraph: any) => (
        <RenderParagraph key={nestedParagraph.id} paragraph={nestedParagraph} />
      ))}
    </div>
  )
}

export default Timeline
