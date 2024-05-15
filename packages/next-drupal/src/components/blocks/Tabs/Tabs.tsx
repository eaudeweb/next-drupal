import { Paragraph } from '@edw/next-drupal/@types'

import React from 'react'

import { Tabs as AntTabs, type TabsProps } from 'antd'
import { DrupalNode } from 'next-drupal'

import { RenderParagraph } from '@edw/next-drupal/molecules'

interface Props {
  node: DrupalNode
  paragraph?: {
    field_title?: string
  } & Paragraph
}

const Tabs: React.FC<Props> = ({ paragraph }) => {
  if (!paragraph) {
    return null
  }

  const { field_paragraphs = [] } = paragraph

  const items: TabsProps['items'] = field_paragraphs.reduce((prev, tab) => {
    return [
      ...prev,
      {
        key: tab.id,
        children: <RenderParagraph key={tab.id} paragraph={tab} />,
        label: tab.field_title,
      },
    ]
  }, [])

  return <AntTabs items={items}></AntTabs>
}

export default Tabs
