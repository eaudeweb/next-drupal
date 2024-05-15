import React from 'react'

import { Col, Flex } from 'antd'

import AnnouncementSVG from '@edw/next-drupal/assets/icons/announcement.svg'
import { DrupalLink } from '@edw/next-drupal/components/ui'
import { createDocButtonURL } from '@edw/next-drupal/helpers'

import './Announcement.scss'

interface AnnouncementProps {
  paragraph: any
}

const Announcement: React.FC<AnnouncementProps> = ({ paragraph }) => {
  const {
    field_body = {},
    field_media_entities = [],
    field_title = '',
  } = paragraph

  const fieldBodyContent = field_body?.value ? field_body.value : ''
  return (
    <Flex className="announcement-paragraph">
      <Col className="announcement-paragraph__icon-container" xl={4}>
        <AnnouncementSVG />
      </Col>
      <Col className="announcement-paragraph__content" xl={20}>
        {field_title && <h6>{field_title}</h6>}
        {fieldBodyContent && (
          <div
            className="announcement-paragraph__field-body-content"
            dangerouslySetInnerHTML={{ __html: fieldBodyContent }}
          />
        )}
        <div className="files-container">
          {field_media_entities &&
            field_media_entities.map((field: any, index: any) => (
              <div key={index} className="announcement-paragraph__entities">
                {field?.field_files &&
                  field.field_files.map(
                    (file: any, j: any) =>
                      file?.uri?.url &&
                      field?.name && (
                        <DrupalLink
                          key={j}
                          className="link-download"
                          href={createDocButtonURL(file.uri.url)}
                          target="_blank"
                        >
                          {field?.name}
                        </DrupalLink>
                      ),
                  )}
              </div>
            ))}
        </div>
      </Col>
    </Flex>
  )
}

export default Announcement
