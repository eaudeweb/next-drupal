import type { SearchAppConfig, SearchMeta } from '@edw/drupal'

import React from 'react'

import toggles from 'classnames'
import { DrupalNode } from 'next-drupal'

import { kebabCase } from '@edw/base'

import ListingItemView from '../ListingItem'

import './SearchListing.scss'

type SearchListingProps = {
  appConfig: SearchAppConfig
  meta: SearchMeta
  results: DrupalNode[]
  searchIndex: string
  searchText?: string
}

const mergeItemExtraData = (item: DrupalNode, data: any) => {
  // Only merge if data exists to avoid unnecessary object spread
  return data ? { ...item, ...data } : item
}

const SearchListing: React.FC<SearchListingProps> = React.memo(
  ({ appConfig, meta, results, searchIndex, searchText }) => {
    const extraData = meta?.extra_data || {}

    return (
      <div
        className={toggles({
          [`search-listing--${kebabCase(searchIndex)}`]: searchIndex,
          'search-listing': true,
        })}
      >
        {results.map((item: DrupalNode) => {
          const mergedItem = mergeItemExtraData(item, extraData[item.id])
          return (
            <ListingItemView
              key={item.id}
              appConfig={appConfig}
              item={mergedItem as any}
              searchText={searchText}
            />
          )
        })}
      </div>
    )
  },
  (prevProps, nextProps) => {
    //dont rerender if data is the same
    return (
      prevProps.results === nextProps.results &&
      prevProps.searchText === nextProps.searchText &&
      prevProps.meta === nextProps.meta
    )
  },
)

SearchListing.displayName = 'SearchListing'

export default SearchListing
