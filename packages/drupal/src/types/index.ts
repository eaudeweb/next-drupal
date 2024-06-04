import type { Breadcrumb, ConfigRegistry } from '@edw/base'
import type { FilterItems } from 'drupal-jsonapi-params'
import type {
  DrupalFile,
  DrupalMedia,
  DrupalNode,
  DrupalParagraph,
  DrupalTaxonomyTerm,
  JsonApiResource,
  JsonApiSearchApiResponse,
} from 'next-drupal'

export interface NodePage {
  breadcrumb: Breadcrumb
  meetings: JsonApiResource[]
  menus: SiteMenus
  node: DrupalNode
}

export interface DocumentDrupalMedia extends DrupalMedia {
  resourceIdObjMeta: {
    drupal_internal__target_id: number
  }
}

export interface ImageDrupalMedia extends DrupalMedia {
  field_image_caption?: string
  field_media_image?: {
    image_style_uri: Record<string, string>
  } & DrupalFile
  resourceIdObjMeta: {
    drupal_internal__target_id: number
  }
}

export interface Paragraph extends DrupalParagraph {
  [key: string]: unknown
  field_paragraphs?: Paragraph[]
  field_title?: string
}

export interface ParagraphWithImageMedia extends Paragraph {
  field_media?: ImageDrupalMedia
}

export type SiteMenus = Record<string, unknown>

export interface TermValue {
  active: boolean
  count: number
  end_date?: string
  label: string
  value: string
}

export type Term = {
  children?: Array<Array<Term>>
  url: string
  values: TermValue
} & { values: TermValue }

export interface Facet {
  id: string
  label: string
  path?: string
  terms: Array<Term>
}

export interface Facets {
  [key: string]: Facet
}

export interface SearchMeta {
  count: number
  extra_data: Record<string, unknown>
  facets: Array<Facet>
}

export interface SearchEngineResults
  extends Omit<JsonApiSearchApiResponse, 'jsonapi'> {
  items: DrupalNode[]
  jsonapi: unknown // this type is wrongly defined upstream
  // data: Array<JsonApiResource>
  // meta: SearchMeta
}

export interface ListingItem extends React.HTMLAttributes<HTMLDivElement> {
  item: DrupalNode
  searchText?: string
  taxonomies?: { [key: string]: DrupalTaxonomyTerm[] }
}

export interface ListingItemConfig {
  view: React.ElementType
}

type SortType = {
  [key: string]: { field?: string; label: string } | undefined
  date?: { field?: string; label: string }
  relevance?: { field?: string; label: string }
}

export interface SearchAppConfig {
  filters: {
    rangeFilters?: object
    view: React.ElementType<SearchFiltersView>
  }
  include: string[]
  listingItems: Record<string, ListingItemConfig>
  pageSize: number
  showListingOnInit: boolean
  sort: SortType
}

export interface NodeFetchSettings {
  summary: {
    // fields to include in a node summary (in listings)
    include: string
  }
  view: {
    // fields to include in a node "main page" view
    include: string // TODO: migrate to list
  }
}

export interface ParagraphSettings {
  style?: any
  templates?: object
  view: React.ComponentType<any>
}

export interface DrupalViewSettings {
  params: {
    [key: string]: string | string[]
  }
}

export interface SortOption {
  field: string
  label: string
  order: string
  value: string
}

export interface SearchAppSettings {
  apps: {
    [key: string]: {
      baseUrl?: string
      emptyText?: string
      filters: {
        rangeFilters?: object
        view: React.ComponentType
      }
      include: string[]
      listingItems: {
        [key: string]: {
          view: React.ComponentType
        }
      }
      pageSize: number
      showListingOnInit: boolean
      sort: SortType
      title: string
    }
  }
}

export interface DrupalConfigRegistry extends ConfigRegistry {
  drupal: {
    baseUrls: {
      DRUPAL_BASE_URL: string
    }
    drupalViews: {
      [key: string]: DrupalViewSettings
      _default: DrupalViewSettings
    }
    nodeTypes: {
      fetchParams: {
        [key: string]: NodeFetchSettings
        _default: NodeFetchSettings
      }
    }
    paragraphs: {
      [key: string]: ParagraphSettings
    }
    search: SearchAppSettings
    siteMenus: string[]
    views: {
      [key: string]: React.ComponentType<any>
    }
  }
}

export interface SearchAppData {
  currentPage: number
  data: SearchEngineResults
  error: any
  hasQuery: boolean
  isFetched: boolean
  isFetching: boolean
  isPending: boolean
  onChangeField: (id: string, value: any) => void
  onChangeMultipleFields: (fields: object) => void
  onChangePage: (page: number, pageSize?: number) => void
  onChangeSort: (field: string, order?: string) => void
  query: any
  // removeField: (id: string) => void
  resetFilters: () => void
  searchText?: string
  total: number
}

export interface SearchFiltersView {
  appConfig: SearchAppConfig
  facets: Facets
  isFetching: boolean
  isPending: boolean
  onChange: (id: string, value: unknown) => void
  onChangeMultiple: (fields: object) => void
  order: string[]
  query: any
  resetFilters: () => void
  searchIndex: string
}

export interface SelectFilterView {
  disabled?: boolean
  id: string
  label?: React.JSX.Element
  onChange: (id: string, value: unknown) => void
  options: Facet['terms']
  placeholder?: string
  taxonomy: string
  value: string | string[] | undefined
}

export interface ExtractedFacets {
  facets: Facets
  order: string[]
}

export type ResolvedQuery = {
  filter: { fulltext?: string } & FilterItems
  page: {
    limit: string
    offset: string
  }
  sort: string | string[]
}

export interface CheckboxFilterProps {
  facet: Facet
  id: string
  label: string
  onChange: (id: string, value: unknown) => void
  value: string[]
}

export type ExtractedFilterValue = string | string[] | undefined

export type AutoCompleteGroupName = string
export type AutoCompleteItem = {
  fields: {
    [key: string]: string
  }
  group?: {
    group_id: string
    group_name: string
  }
  link: string
  value: string
}

export type AutoCompleteResults = {
  [key: AutoCompleteGroupName]: AutoCompleteItem[]
}

export type AutoCompleteData = {
  data: AutoCompleteResults
  error: any
  isFetching: boolean
  isPending: boolean
}
