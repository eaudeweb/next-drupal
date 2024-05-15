'use client' // This is a client component 👈🏽

import React, { useState } from 'react'

import { Collapse } from 'antd'

import { RenderParagraph } from '@edw/next-drupal/molecules'

interface Props {
  paragraph: any
}

const Accordion: React.FC<Props> = ({ paragraph }) => {
  const firstKey =
    paragraph.field_paragraphs.map((item: any) => item.id)[0] || null
  const [activeKey, setActiveKey] = useState(firstKey)

  const handleChange = (key: string | string[]) => {
    setActiveKey(key)
  }

  const items = paragraph.field_paragraphs.map((item: any) => ({
    key: item.id,
    children: (
      <>
        {item.field_paragraphs?.map((nestedParagraph: any) => (
          <RenderParagraph
            key={nestedParagraph.id}
            paragraph={nestedParagraph}
          />
        ))}
      </>
    ),
    label: item.field_title,
  }))

  return (
    <Collapse activeKey={activeKey} items={items} onChange={handleChange} />
  )
}

export default Accordion
