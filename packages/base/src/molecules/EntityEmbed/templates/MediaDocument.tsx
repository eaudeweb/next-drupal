import React from 'react'

// @todo Miu: cylic dependency
// import { DrupalFile } from 'next-drupal'

// import { GroupedFiles } from '../../../../../../apps/multilateralfund/components/files/GroupedFiles'
interface MediaDocumentProps {
  entity: any
}

const MediaDocument: React.FC<MediaDocumentProps> = ({ entity }) => {
  if (!entity) return null
  return null

  // return (
  //   <GroupedFiles files={Object.values(entity.pseudo_files) as DrupalFile[]} />
  // )
}

export default MediaDocument
