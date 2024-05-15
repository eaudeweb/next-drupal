import React from 'react'

import { DrupalFile } from 'next-drupal'

// @todo: needs to move into app
// @ts-ignore - cyclic dependency
// eslint-disable-next-line import/no-unresolved
import { GroupedFiles } from '../../../../../../apps/multilateralfund/components/files/GroupedFiles'
interface MediaDocumentProps {
  entity: any
}

const MediaDocument: React.FC<MediaDocumentProps> = ({ entity }) => {
  if (!entity) return null

  return (
    <GroupedFiles files={Object.values(entity.pseudo_files) as DrupalFile[]} />
  )
}

export default MediaDocument
