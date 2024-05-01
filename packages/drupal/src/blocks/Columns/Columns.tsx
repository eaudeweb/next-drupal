import React from 'react'

import { Col, Row } from 'antd'
import toggles from 'classnames'
import chunk from 'lodash.chunk'

import { RenderParagraph } from '../../molecules/RenderParagraph'
import { Paragraph } from '../../types'

import './Columns.scss'

type Props = {
  paragraph?: {
    field_columns_layout: string
    layout: string
  } & Paragraph
}

const getSpanValues = (layout: string): number[] => {
  const layoutRatios: { [key: string]: number[] } = {
    '25-25-25-25': [6, 6, 6, 6],
    '25-75': [6, 18],
    '33-33-33': [8, 8, 8],
    '33-66': [8, 16],
    '50-50': [12, 12],
    '66-33': [16, 8],
    '75-25': [18, 6],
    '100': [24],
    // Add new layout options
  }

  return layoutRatios[layout] ?? []
}

const Columns: React.FC<Props> = ({ paragraph }) => {
  if (!paragraph) return null

  const layout = paragraph?.field_columns_layout
  const paragraphs = paragraph?.field_paragraphs

  const spanValues = getSpanValues(layout)

  const chunks = chunk(paragraphs, spanValues.length)

  return (
    <>
      {chunks &&
        chunks.map((row: any, rowIndex: number) => {
          return (
            <Row key={rowIndex} className="columns-paragraph">
              {row &&
                row.length > 0 &&
                row.map((item: any, index: number) => (
                  <Col
                    key={index}
                    className={toggles({
                      column: true,
                      'column-first': index % spanValues.length === 0,
                      'column-last':
                        index % spanValues.length === spanValues.length - 1,
                    })}
                    md={spanValues[index % spanValues.length]}
                    span={24}
                  >
                    <div className="column-inner">
                      <RenderParagraph paragraph={item} />
                    </div>
                  </Col>
                ))}
            </Row>
          )
        })}
    </>
  )
}

export default Columns
