import React from 'react'

import { DrupalNode } from 'next-drupal'

import { RenderParagraphs } from '@edw/drupal/molecules'
import { Paragraph } from '@edw/drupal/types'

interface Props {
  node: DrupalNode
  paragraph?: Paragraph
}

const Tabs: React.FC<Props> = ({ node, paragraph }) => {
  if (!paragraph) {
    return null
  }

  const { field_paragraphs } = paragraph

  return <RenderParagraphs node={node} paragraphs={field_paragraphs || []} />
}

export default Tabs
