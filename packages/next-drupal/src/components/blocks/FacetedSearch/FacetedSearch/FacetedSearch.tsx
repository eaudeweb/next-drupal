import React from 'react'

import { Flex, Pagination, type PaginationProps, message } from 'antd'

import config from '@edw/next-drupal/config'

import { Container } from '@edw/next-drupal/components/ui'
import { withClientOnly } from '@edw/next-drupal/hocs'
import { useSearchApp } from '@edw/next-drupal/hooks'
import { ParagraphLoader, ScrollTarget } from '@edw/next-drupal/molecules'

import SearchFilters from '../SearchFilters'
import SearchListing from '../SearchListing/SearchListing'
import Sort from '../Sort'
import BackArrow from './back-arrow.svg'
import NextArrow from './next-arrow.svg'

import './FacetedSearch.scss'

type FacetedSearchProps = {
  searchIndex: any
}

type TotalResultsProps = {
  total: number
}

const TotalResults: React.FC<TotalResultsProps> = ({ total }) => (
  <p className="faceted-search__total-results h6">{total} results found</p>
)

const FacetedSearch: React.FC<FacetedSearchProps> = ({ searchIndex }) => {
  const appConfig = config.drupal.search.apps[searchIndex]
  const sortConfigOptions = appConfig?.sort
  const {
    currentPage,
    data: { items, meta },
    error,
    hasQuery,
    isFetched,
    isFetching,
    isPending,
    onChangeField,
    onChangeMultipleFields,
    onChangePage,
    onChangeSort,
    query,
    resetFilters,
    searchText,
    total,
  } = useSearchApp(searchIndex, appConfig)

  const [messageApi, contextHolder] = message.useMessage()

  React.useEffect(() => {
    if (error) {
      messageApi.error('Error in fetching results', 5)
    }
  }, [messageApi, error])
  const hasNetworkActivity = isPending || (isFetching && !isFetched)

  const itemRender: PaginationProps['itemRender'] = (
    _,
    type,
    originalElement,
  ) => {
    if (type === 'prev') {
      return <BackArrow />
    }
    if (type === 'next') {
      return <NextArrow />
    }
    return originalElement
  }
  return (
    <>
      <ScrollTarget dependencies={query?.page?.offset ?? 0} />
      <div className="search-block">
        {contextHolder}
        {hasNetworkActivity && <ParagraphLoader />}
        <SearchFilters
          appConfig={appConfig}
          isFetching={isFetching}
          isPending={isPending}
          meta={meta}
          query={query}
          resetFilters={resetFilters}
          searchIndex={searchIndex}
          onChange={onChangeField}
          onChangeMultiple={onChangeMultipleFields}
        />
        {hasQuery || items?.length > 0 ? (
          <>
            <Container size="small">
              {!hasNetworkActivity && (
                <Flex className="results-toolbar border-bottom">
                  <TotalResults total={total} />
                  {sortConfigOptions &&
                    Object.keys(sortConfigOptions).length > 1 &&
                    searchIndex !== 'news' && (
                      <Sort
                        configOptions={sortConfigOptions}
                        query={query}
                        onChange={onChangeSort}
                      />
                    )}
                </Flex>
              )}
              {total > 0 && (
                <SearchListing
                  appConfig={appConfig}
                  meta={meta}
                  results={items || []}
                  searchIndex={searchIndex}
                  searchText={searchText}
                />
              )}
              {total == 0 && appConfig.emptyText && (
                <Flex>{appConfig.emptyText}</Flex>
              )}
            </Container>
            {total > 0 && (
              <Pagination
                current={currentPage}
                itemRender={itemRender}
                pageSize={appConfig.pageSize}
                showSizeChanger={false}
                total={meta.count}
                onChange={onChangePage}
                hideOnSinglePage
              />
            )}
          </>
        ) : null}
      </div>
    </>
  )
}

export default withClientOnly(FacetedSearch)
