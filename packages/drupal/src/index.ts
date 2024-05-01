export * from './blocks'
import type { DrupalConfigRegistry } from './types'

import handleAutoComplete from './api/autocompleteHandler'
import handleDrupalSearch from './api/searchHandler'
import handleTaxonomyTerm from './api/taxonomyTermHandler'
import handleWebForm from './api/webFormHandler'
import {
  Accordion,
  Announcement,
  BlockItem,
  Card,
  Columns,
  ContainerParagraph,
  ContentReference,
  DocumentReferenceParagraph,
  Fact,
  FactFigures,
  ImageParagraph,
  Quote,
  RichText,
  SearchBlock,
  Timeline,
  TimelineItem,
  ViewReference,
} from './blocks'
import Banner from './blocks/Banner/Banner'
import {
  DefaultTemplate,
  EventDefaultTemplate,
  NewsAlternativeTemplate,
  NewsDefaultTemplate,
  ProjectTemplate,
} from './blocks/ContentReference/templates'

export * from './lib'
export * from './molecules'
export * from './types'

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

//https://github.com/d34dman/drupal-jsonapi-params
//.addInclude(['field_content.paragraph_type', 'field_content.field_entities', 'field_c.tid'])
//consider using ^^ for better params control
export function applyConfig(
  config: DrupalConfigRegistry,
): DrupalConfigRegistry {
  config.apiHandlers = [
    ...config.apiHandlers,
    { handler: handleWebForm, matcher: /webform\/?$/ },
    { handler: handleDrupalSearch, matcher: /drupal-search\/(.*)/ },
    {
      handler: handleAutoComplete,
      matcher: /drupal-search-autocomplete\/(.*)/,
    },
    {
      handler: handleTaxonomyTerm,
      matcher: /drupal-taxonomy-term\/(.*)/,
    },
  ]

  config.drupal = {
    ...(config.drupal || {}),

    baseUrls: {
      DRUPAL_BASE_URL: DRUPAL_BASE_URL || '',
    },
    drupalViews: {
      _default: {
        params: {
          'fields[media--document]':
            'id,name,field_date_time,field_document_notes,field_document_number,field_countries,field_meetings',
          'fields[node--event]':
            'id,title,path,number,field_number,field_date_notes,field_date_range,field_hide_date',
          'fields[taxonomy_term--countries]': 'id,name,field_iso_2,field_iso_3',
          include: 'field_countries,field_meetings',
          'views-argument': ['all'],
        },
      },
    },
    nodeTypes: {
      // default inclusion fields for content types
      fetchParams: {
        _default: {
          summary: {
            include: 'title,path,uid,created,content_translations',
          },
          view: {
            include: 'title,path,uid,created,content_translations',
          },
        },
        'node--page': {
          summary: {
            include: 'title,path,uid,created,content_translations',
          },
          view: {
            include:
              'field_content.paragraph_type,' +
              'field_content.field_entities,' +
              'field_content.field_paragraphs.field_paragraphs,' +
              'field_content,' +
              'field_content.field_paragraphs.field_media.field_media_image,' +
              'field_content.field_media.field_media_image,' +
              'field_content.field_view,' +
              'field_content.field_paragraphs.field_paragraphs.field_paragraphs,' +
              'field_content.field_paragraphs.field_paragraphs.field_media.field_media_image,' +
              'field_content.field_paragraphs.field_paragraphs.field_paragraphs.field_paragraphs',
          },
        },
      },
    },
    paragraphs: {
      // paragraph renderers
      ...(config.drupal?.paragraphs || {}),
      'paragraph--edw_accordion': {
        view: Accordion,
      },
      'paragraph--edw_announcement': {
        view: Announcement,
      },
      'paragraph--edw_banner': {
        view: Banner,
      },
      'paragraph--edw_block_item': {
        view: BlockItem,
      },
      'paragraph--edw_card': {
        view: Card,
      },
      'paragraph--edw_columns': {
        view: Columns,
      },
      'paragraph--edw_container': {
        view: ContainerParagraph,
      },
      'paragraph--edw_content_reference': {
        templates: {
          default: { view: DefaultTemplate },
          'node--event': { view: EventDefaultTemplate },
          'node--news': { view: NewsDefaultTemplate },
          'node--news--alternative': { view: NewsAlternativeTemplate },
          'node--project': { view: ProjectTemplate },
        },
        view: ContentReference,
      },
      'paragraph--edw_document': {
        view: DocumentReferenceParagraph,
      },
      'paragraph--edw_fact': {
        view: Fact,
      },
      'paragraph--edw_facts_figures': {
        view: FactFigures,
      },
      'paragraph--edw_image': {
        view: ImageParagraph,
      },
      'paragraph--edw_quote': {
        view: Quote,
      },
      'paragraph--edw_rich_text': {
        view: RichText,
      },
      'paragraph--edw_timeline': {
        view: Timeline,
      },
      'paragraph--edw_timeline_item': {
        view: TimelineItem,
      },
      'paragraph--edw_view': {
        view: ViewReference,
      },
      'paragraph--search_index': {
        view: SearchBlock,
      },
    },
    search: {
      apps: {},
    }, // search blocks configuration
    siteMenus: ['main', 'footer'], // these menus will be fetched for all pages
    views: {},
  }

  return config
}
