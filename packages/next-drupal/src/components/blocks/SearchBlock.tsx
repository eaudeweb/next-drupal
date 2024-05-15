import { Empty } from 'antd'
import { DrupalParagraph } from 'next-drupal'

import FacetedSearch from './FacetedSearch/FacetedSearch/FacetedSearch'

type SearchBlockProps = {
  paragraph: DrupalParagraph
}

const SearchBlock: React.FC<SearchBlockProps> = ({ paragraph }) => {
  const searchIndex =
    paragraph.field_search_index?.resourceIdObjMeta?.drupal_internal__target_id

  // console.log(paragraph, 'searchparagraph')
  return searchIndex ? (
    <>
      {paragraph?.field_title && (
        <h3 className="search-block__title">{paragraph.field_title}</h3>
      )}
      <FacetedSearch searchIndex={searchIndex} />
    </>
  ) : (
    <Empty description="Search index not selected." />
  )
}
export default SearchBlock
