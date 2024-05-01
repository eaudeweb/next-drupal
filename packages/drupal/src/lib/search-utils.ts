import type { ResolvedQuery } from '@edw/drupal'
import type { FilterItemType } from 'drupal-jsonapi-params'

import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DrupalSearchApiFacet } from 'next-drupal'
import { P, match } from 'ts-pattern'

import {
  ExtractedFacets,
  ExtractedFilterValue,
  SearchAppConfig,
} from '../types'

// {
//     "filter": {
//         "country": {
//             "condition": {
//                 "path": "country",
//                 "value": [
//                     "3",
//                     "4",
//                     "1"
//                 ],
//                 "operator": "IN"
//             }
//         }
//     },
//     "include": [],
//     "page": {
//         "limit": 5
//         "offset": 0
//     },
//     "sort": [],
//     "fields": {}
// }

export const filterTypeHandler = (
  id: string,
  value: any,
  djap: DrupalJsonApiParams,
) => {
  const data = djap.getQueryObject()
  const baseField = id.replace(':type', '')

  let oldValue = { condition: { operator: '=', path: baseField, value: [] } }

  if (Object.keys(data.filter || {}).includes(baseField)) {
    oldValue = data.filter[baseField]
    delete data.filter[baseField]
  }

  const replacement = new DrupalJsonApiParams(data)
  replacement.addFilter(
    baseField,
    oldValue.condition.value,
    value === 'any' ? 'IN' : value === 'all' ? '=' : '=',
  )

  return replacement
}

export const handleTextField = (
  id: string,
  value: string,
  djap: DrupalJsonApiParams,
) => {
  const data = (djap as any).data

  //remove prev fulltext
  if (data.filter[id]) {
    delete data.filter[id]
  }

  if (value.trim()) djap.addFilter(id, value ?? '')

  return djap
}

export const multiValueHandler = (
  id: string,
  value: any,
  djap: DrupalJsonApiParams,
) => {
  const data = (djap as any).data

  if (typeof data.filter[id] !== 'undefined') {
    delete data.filter[id]
  }

  if (Array.isArray(value)) {
    djap.addFilter(id, value, 'IN')
  } else {
    djap.addFilter(id, value ?? '')
  }

  return djap
}

export const removeFilter = (
  id: string,
  djap: DrupalJsonApiParams,
): DrupalJsonApiParams => {
  const data = (djap as any).data
  if (typeof data.filter[id] !== 'undefined') {
    delete data.filter[id]
  }

  return djap
}

export const applyFilter = (
  qs: string | string[],
  appConfig: SearchAppConfig,
  id: string,
  value: any,
): string => {
  let djap = new DrupalJsonApiParams(qs)
  djap.addPageLimit(appConfig.pageSize)
  djap.addPageOffset(0)

  // TODO: implement proper e2e handling of arbitrary filter types
  if (value === null || !value || value === '') {
    djap = removeFilter(id, djap)
  } else if (id === 'fulltext') {
    djap = handleTextField(id, value, djap)
  } else if (id.match(/:type/)) {
    djap = filterTypeHandler(id, value, djap)
  } else {
    djap = multiValueHandler(id, value, djap)
  }

  // Note: we need to serialize as a string because the nextjs router only
  // allows simple objects (string | string[]) for query values
  const query = djap.getQueryObject()
  const hasQuery = queryHasConditions(query as ResolvedQuery)
  return hasQuery ? djap.getQueryString() : ''
}

export const getCurrentPage = (
  query: ResolvedQuery | undefined,
  pageSize = null,
) => {
  const offset = Math.floor(parseInt(query?.page?.offset || '0'))
  const _pageSize = pageSize || query?.page?.limit || '10'
  const size = parseInt(_pageSize) || 10
  return Math.floor(offset / size) + 1
}

export const getFilterValue = (value: FilterItemType): ExtractedFilterValue =>
  match(value)
    // .returnType<string | string[] | undefined>()   // only in v5
    .with(P.string, identity)
    .with({ value: P.select() }, identity)
    .with({ condition: { value: P.select() } }, identity)
    .with(P._, () => undefined)
    .exhaustive()

// const filter = query.filter[k]
// let value
// if (typeof filter === 'string') {
//   value = filter
// } else if ((filter as FilterItemShort).value) {
//   value = (filter as FilterItemShort).value
// } else if ((filter as FilterItem).condition) {
//   value = (filter as FilterItem).condition?.value
// }

function identity<T>(arg: T): T {
  return arg
}

export const queryHasConditions = (query: ResolvedQuery): boolean => {
  if (Object.keys(query.filter).length === 0) return false

  let hasQuery = false

  Object.keys(query.filter).forEach((k) => {
    if (k === 'fulltext' && (query.filter[k] || '').trim()) {
      hasQuery = true
      return
    }

    const value = getFilterValue(query.filter[k])
    if (!value) return

    if (Array.isArray(value)) {
      hasQuery = hasQuery || value.length > 0
      return
    }
    hasQuery = hasQuery || !!value
  })

  return hasQuery
}

export function extractFacets(facets: DrupalSearchApiFacet[]): ExtractedFacets {
  const result: ExtractedFacets = {
    facets: Object.assign(
      {},
      ...facets.map((f) => ({ [f.path as string]: f })),
    ),
    order: [...facets.map(({ path }) => path || '').filter((p) => !!p)],
  }
  return result
}
