import { DrupalView } from 'next-drupal'

import { BackendError, NotFoundError } from '@edw/next-drupal/errors'

import { deserialize, drupal } from '.'

export interface Params {
  include: string
  'views-argument': [number, string]
}

async function getViewContent(
  viewId?: string,
  params?: Params,
): Promise<DrupalView> {
  if (!viewId) {
    throw new NotFoundError('View ID is required to fetch view content')
  }
  let view: DrupalView | null
  const options = params ? { deserialize: false, params } : undefined

  try {
    view = await drupal.getView(viewId, options)
  } catch (error) {
    throw new BackendError(
      `Could not fetch view content for viewId: ${viewId}. ${error.message}`,
    )
  }

  if (!view) {
    throw new NotFoundError(`View content not found for viewId: ${viewId}`)
  }

  // deserialize results if params are provided
  const results = params ? deserialize(view.results) : view.results

  // include `extra_meta` if it exists
  // @ts-ignore @todo: check why extra_meta is not in the type
  const extra_meta = view?.results?.extra_meta
  const updatedView = extra_meta
    ? { ...view, extra_meta, results }
    : { ...view, results }

  return updatedView as DrupalView
}

export { getViewContent }
