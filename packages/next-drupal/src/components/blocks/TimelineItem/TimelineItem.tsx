import { ParagraphWithImageMedia } from '@edw/next-drupal/@types'

import React from 'react'

import { Flex } from 'antd'
import toggles from 'classnames'

import { Image, RenderParagraph } from '@edw/next-drupal/molecules'

import DefaultTimeLineEntry from './defaultTimelineEntry.svg'
import HighlightEllipse from './highlightellipse.svg'

import './TimelineItem.scss'

interface TimelineItemProps {
  paragraph?: {
    field_text_plain: string
    field_timeline_item_variations: string
  } & ParagraphWithImageMedia
}

const TimelineItem: React.FC<TimelineItemProps> = ({ paragraph }) => {
  if (!paragraph) {
    return null
  }

  const {
    field_media,
    field_paragraphs = [],
    field_text_plain = '',
    field_timeline_item_variations,
    field_title = '',
  } = paragraph

  return (
    <div
      className={toggles({
        default: field_timeline_item_variations === 'variation1',
        highlighted: field_timeline_item_variations === 'variation2',
        'timeline-item': true,
      })}
    >
      <div
        className={toggles({
          default: field_timeline_item_variations === 'variation1',
          highlighted: field_timeline_item_variations === 'variation2',
          'timeline-item__container': true,
        })}
      >
        <div className="timeline-item__entry-container">
          <DefaultTimeLineEntry />
        </div>
        {field_timeline_item_variations === 'variation2' && (
          <HighlightEllipse className="highlight-ellipse" />
        )}
        <Flex
          className="timeline-item__inner"
          align="center"
          justify="space-between"
        >
          <div className="timeline-item__content-area">
            <div className="timeline-item__content-area-heading">
              <p className="timeline-item__label h8">{field_text_plain}</p>

              <h5>{field_title}</h5>
            </div>
            {field_paragraphs?.length > 0 &&
              field_paragraphs.map((nestedParagraph: any) => (
                <RenderParagraph
                  key={nestedParagraph.id}
                  paragraph={nestedParagraph}
                />
              ))}
          </div>

          {field_media && (
            <div className="timeline-item__img-container">
              <Image media={field_media} width={768} />
              {field_media?.field_image_caption && (
                <p className="timeline-item__img-caption">
                  {field_media?.field_image_caption}
                </p>
              )}
            </div>
          )}
        </Flex>
      </div>
    </div>
  )
}

export default TimelineItem
