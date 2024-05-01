import { deserialize, drupal } from '@edw/drupal'

interface Params {
  include: string
  'views-argument': [number, string]
}

async function getViewContent(viewId: string, params?: Params) {
  try {
    const updatedParams = params ? { ...params, deserialize: false } : undefined
    const view = await drupal.getView(viewId, updatedParams)

    if (!view) {
      console.error(
        `View content not found for viewId: ${viewId} with params:`,
        params,
      )
      return null
    }

    // deserialize results if params are provided
    const results = params ? deserialize(view.results) : view.results

    // include `extra_meta` if it exists
    const extra_meta = view?.results?.extra_meta
    const updatedView = extra_meta
      ? { ...view, extra_meta, results }
      : { ...view, results }

    return updatedView
  } catch (error) {
    console.error(
      `Error fetching view content for viewId: ${viewId} with params:`,
      params,
      error,
    )
    return null
  }
}

export { getViewContent }
