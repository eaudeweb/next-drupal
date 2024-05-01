import type { SearchAppConfig, SearchEngineResults } from '../../types'

import React from 'react'

import { extractFacets } from '../../lib/search-utils'

type SearchFiltersProps = {
  appConfig: SearchAppConfig
  isFetching: boolean
  isPending: boolean
  meta: SearchEngineResults['meta']
  onChange: (id: string, value: unknown) => void
  onChangeMultiple: (fields: object) => void
  query: any
  resetFilters: () => void
  searchIndex: string
}

const SearchFilters: React.FC<SearchFiltersProps> = React.memo(
  ({
    appConfig,
    isFetching,
    isPending,
    meta,
    onChange,
    onChangeMultiple,
    query,
    resetFilters,
    searchIndex,
  }): React.JSX.Element => {
    const View = appConfig?.filters?.view
    const { facets, order } = React.useMemo(
      () => extractFacets(meta?.facets || []),
      [meta],
    )

    if (!View) return <span>No view for this search index: {searchIndex}</span>

    return (
      <View
        appConfig={appConfig}
        facets={facets}
        isFetching={isFetching}
        isPending={isPending}
        order={order}
        query={query}
        resetFilters={resetFilters}
        searchIndex={searchIndex}
        onChange={onChange}
        onChangeMultiple={onChangeMultiple}
      />
    )
  },
)

SearchFilters.displayName = 'SearchFilters'

export default SearchFilters
