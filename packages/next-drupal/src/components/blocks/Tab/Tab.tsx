import { Paragraph } from '@edw/next-drupal/@types'

import React from 'react'

import { DrupalNode } from 'next-drupal'

import { RenderParagraphs } from '@edw/next-drupal/molecules'

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
