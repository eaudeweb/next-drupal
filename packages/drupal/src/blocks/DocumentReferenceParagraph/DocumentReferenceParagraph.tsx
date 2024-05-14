import type { DocumentDrupalMedia, Paragraph } from '@edw/drupal'

// @ts-ignore
// import { GroupedFiles } from '../../../../../apps/multilateralfund/components/files/GroupedFiles'

import './DocumentReferenceParagraph.scss'

interface DocumentReferenceParagraphProps {
  paragraph: {
    field_media_entities: DocumentDrupalMedia[]
  } & Paragraph
}

const DocumentReferenceParagraph: React.FC<DocumentReferenceParagraphProps> = ({
  paragraph,
}) => {
  const { field_title } = paragraph

  return (
    <div className="document-reference-paragraph">
      <p className="document-reference-paragraph__title h6 border-bottom">
        {field_title}
      </p>
      {paragraph.field_media_entities.map((doc, k) => (
        <div key={k} className="document-reference-paragraph-item">
          <div className="h7">{doc.name}</div>
          {/* <GroupedFiles files={doc?.pseudo_files} /> */}
          <div className="border-bottom--secondary"></div>
        </div>
      ))}
    </div>
  )
}

export default DocumentReferenceParagraph
