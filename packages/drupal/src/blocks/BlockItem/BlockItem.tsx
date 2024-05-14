import { config } from '@edw/base'

import './BlockItem.scss'

const BlockItem = ({ paragraph }: any) => {
  const blockType = paragraph?.field_block?.plugin_id
  const paragraphType = paragraph?.type

  if (!blockType) {
    return <p>Block type not set</p>
  }

  if (!paragraphType) {
    return <p>Paragraph type type not set</p>
  }

  const ViewComponent =
    config?.drupal?.paragraphs?.[paragraphType]?.templates?.[blockType]?.view

  if (!ViewComponent) return <p>There is no block view for id: {blockType}</p>

  return <ViewComponent paragraph={paragraph} />
}

export default BlockItem
