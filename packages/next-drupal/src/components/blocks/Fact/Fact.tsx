import { DrupalParagraph } from 'next-drupal'

import { parseAndTransformRichText } from '@edw/next-drupal/helpers'

type FactBlock = {
  paragraph: DrupalParagraph
}

const Fact: React.FC<FactBlock> = ({ paragraph }) => {
  const content = paragraph?.field_description?.value
    ? parseAndTransformRichText(paragraph.field_description.value)
    : ''
  return <div>{content}</div>
}
export default Fact
