import { Paragraph } from '@edw/next-drupal/@types'

import React from 'react'

import { DrupalNode } from 'next-drupal'

import config from '@edw/next-drupal/config'

type ParagraphProps = {
  node?: DrupalNode
  paragraph: Paragraph
}

type ParagraphsProps = {
  node: DrupalNode
  paragraphs: Paragraph[]
}

export const RenderParagraph: React.FC<ParagraphProps> = ({
  node,
  paragraph,
}) => {
  if (!paragraph) {
    return <div>Loading...</div>
  }

  const paragraphTypeConfig = config.drupal.paragraphs[paragraph.type]

  if (!paragraphTypeConfig) {
    return <div>Unknown paragraph type: {paragraph.type}</div>
  }

  const ParagraphComponent = paragraphTypeConfig.view

  return (
    <ParagraphComponent
      id={`content-paragraph-${paragraph.drupal_internal__id}`}
      node={node}
      paragraph={paragraph}
    />
  )
}

export const RenderParagraphs: React.FC<ParagraphsProps> = ({
  node,
  paragraphs,
}) => {
  return (
    <>
      {paragraphs.map((paragraph) => (
        <RenderParagraph key={paragraph.id} node={node} paragraph={paragraph} />
      ))}
    </>
  )
}
