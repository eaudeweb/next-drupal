import type { AutoCompleteResults, SiteMenus } from '../../types'
import type { Breadcrumb } from '@edw/base'
import type {
  BaseUrl,
  DrupalClientOptions,
  DrupalTranslatedPath,
  JsonApiResponse,
  JsonApiWithAuthOptions,
} from 'next-drupal'

import { Session } from 'next-auth'
import { JsonApiErrors, DrupalClient as NextDrupalClient } from 'next-drupal'

import { NotFoundError, config } from '@edw/base'

import { buildMenu, getDecoupledMenu } from '../menu'

interface DrupalBreadcrumbEntry {
  link: string
  title: string
}

const DEFAULT_WITH_AUTH = false

export default class DrupalClient extends NextDrupalClient {
  _session?: Session | null
  _withAuth: DrupalClientOptions['withAuth'] // withAuth from NextDrupalClient is private
  jsonApiApiPath: string

  constructor(baseUrl: BaseUrl, options: DrupalClientOptions) {
    super(baseUrl, options)

    this._withAuth = options.withAuth || DEFAULT_WITH_AUTH
    this.jsonApiApiPath = '/api/v1'
  }

  private async _getErrorsFromResponse(response: Response) {
    const type = response.headers.get('content-type')

    if (type === 'application/json') {
      const error = await response.json()
      return error.message
    }

    // Construct error from response.
    // Check for type to ensure this is a JSON:API formatted error.
    // See https://jsonapi.org/format/#errors.
    if (type === 'application/vnd.api+json') {
      const _error: JsonApiResponse = await response.json()

      if (_error?.errors?.length) {
        return _error.errors
      }
    }

    return response.statusText
  }

  private async _handleJsonApiErrors(response: Response) {
    if (!response?.ok) {
      const errors = await this._getErrorsFromResponse(response)
      throw new JsonApiErrors(errors, response.status)
    }
  }

  async getBreadcrumb(
    path: string,
    excludeHome: boolean = false,
    options: any = {},
  ): Promise<Breadcrumb> {
    const url = this.buildUrl(
      `${this.jsonApiApiPath}/breadcrumb?path=${encodeURIComponent(path)}`,
    )
    const response = await this.fetch(url.toString(), options)

    const json = await response.json()

    if (excludeHome && json.data?.length > 0 && json.data[0].link === '/') {
      // Exclude the home item from the breadcrumb.
      json.data.shift()
    }

    return {
      items:
        json.data?.length <= 1
          ? []
          : json.data?.map(({ link, title }: DrupalBreadcrumbEntry) => ({
              title: title || '',
              url: link || '',
            })),
      path: json.path,
    }
  }

  async getDecoupledMenu(name: string): Promise<any> {
    return await getDecoupledMenu(name)
  }

  async getSearchAutocomplete(
    index: string,
    options: any = {},
  ): Promise<AutoCompleteResults> {
    const url = this.buildUrl(
      `/jsonapi/index/${index}/suggestions`,
      options.params,
    )
    const response = await this.fetch(url.toString(), options)
    const json = await response.json()
    return json
  }

  async getSiteMenus(): Promise<SiteMenus> {
    const menus = config.drupal.siteMenus || []
    const fetches = menus.map(async (name: string) => await this.getMenu(name))
    const fetchedMenus = Object.assign(
      {},
      ...(await Promise.all(fetches)).map((r, i) => ({
        [menus[i]]: buildMenu(r.items),
      })),
    )
    return fetchedMenus
  }

  async getTaxonomyTerm(
    taxonomy: string,
    term: string,
    options: any = {},
  ): Promise<AutoCompleteResults> {
    const url = this.buildUrl(`/jsonapi/taxonomy_term/${taxonomy}`, {
      filter: {
        drupal_internal__tid: term,
      },
    })
    const response = await this.fetch(url.toString(), options)
    const json = await response.json()
    return json
  }

  async translatePath(
    path: string,
    options?: JsonApiWithAuthOptions,
  ): Promise<DrupalTranslatedPath> {
    options = {
      withAuth: this._withAuth,
      ...options,
    }

    const url = this.buildUrl('/router/translate-path', {
      path,
    })

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    if (!response?.ok) {
      switch (response.status) {
        case 500:
          throw new NotFoundError()
        default:
          await this._handleJsonApiErrors(response)
      }
    }

    return await response.json()
  }

  set session(session: Session | null | undefined) {
    this._session = session
  }

  get session(): Session | null | undefined {
    return this._session
  }
}
