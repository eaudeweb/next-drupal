import { NodePage } from '@edw/next-drupal/@types'
import type {
  GetServerSidePropsContext,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import type { DrupalNode, JsonApiResource } from 'next-drupal'

import config from '@edw/next-drupal/config'

import { BackendError, NotFoundError } from '@edw/next-drupal/errors'

import { deserialize, drupal } from '.'

interface ExtendedDrupalNode extends DrupalNode {
  extra_meta: any
}

/**
 * Get a list of path objects that "belong" to a certain context
 *
 * This can be used to implement `getStaticPaths` for a page route
 */
export const getStaticPathsForTypes = async (
  context: GetStaticPropsContext,
  nodeTypes = ['node--event'],
): Promise<any[]> => {
  const paths = await drupal.getStaticPathsFromContext(nodeTypes, context)
  return paths
}

export const getDrupalResourceFromContext = async (
  nextContext: GetServerSidePropsContext | GetStaticPropsContext,
  // auth: any
): Promise<ExtendedDrupalNode> => {
  const context = {
    ...nextContext,
    params: {
      slug: ['/'],
      ...(nextContext.params || {}),
    },
  }

  const path = await drupal.translatePathFromContext(context)

  if (path === null) throw new NotFoundError()

  const include = path.jsonapi_include ? path.jsonapi_include.join(',') : ''

  // https:documenter.getpostman.com/view/30594230/2s9YeBfDzo
  const params = { include }
  const resource: DrupalNode = await drupal.getResourceFromContext(
    path,
    context,
    {
      deserialize: false,
      params,
    },
  )

  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.

  if (!resource || resource?.data?.id?.length === 0) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi?.individual}`)
  }

  const extra_meta = resource?.extra_meta ? resource?.extra_meta : {}
  const deserializedResource = deserialize(resource)
  const updatedResource: ExtendedDrupalNode = {
    ...(deserializedResource as DrupalNode),
    extra_meta,
  }

  return updatedResource
}

export const fetchResource = async (
  nodeType: string,
  id: string,
): Promise<JsonApiResource | null> => {
  try {
    return await drupal.getResource(nodeType, id)
  } catch (error) {
    console.error(`Failed to fetch data for ${nodeType} with ID ${id}:`, error)
    return null
  }
}

// will this be used?
// if y TODO: use include params from jsonapi_include
// like getDrupalResourceFromContext
export const fetchResourceCollection = async (
  context: GetStaticPropsContext,
  nodeType: string,
  lang = 'en',
  status = 1,
  sort = '-created',
): Promise<JsonApiResource[]> => {
  const defaultNodeConfig = config.drupal.nodeTypes.fetchParams._default
  const fields =
    config.drupal.nodeTypes.fetchParams[nodeType]?.view?.include ||
    defaultNodeConfig.include.view
  const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    nodeType,
    context,
    {
      params: {
        [`fields[${nodeType}]`]: fields,
        'filter[langcode]': lang,
        'filter[status]': status,
        include: 'uid', // field_image,uid
        sort,
      },
    },
  )
  return nodes
}

export const getDefaultStaticProps = async (
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<NodePage>> => {
  // this calls
  // https://<drupal-backend>/router/translate-path?path=%2Fmeetings%2F88th-meeting
  let node: DrupalNode
  try {
    node = await getDrupalResourceFromContext(context)
  } catch (e) {
    if (e instanceof NotFoundError) {
      console.error('Not found', e)
      return {
        notFound: true,
        revalidate: 60,
      }
    } else {
      throw new BackendError('Error in fetching Drupal node', { cause: e })
    }
  }

  const path = drupal.getPathFromContext(context)

  const slug = context?.params?.slug as string[]
  const requestedPath = slug ? '/' + slug.join('/') : null
  const canonicalPath = node.path && node.path.alias ? node.path.alias : null

  // redirect to the canonical URL
  // if the requested path and canonical path are defined and different
  if (requestedPath && canonicalPath && requestedPath !== canonicalPath) {
    return {
      redirect: {
        destination: canonicalPath,
        permanent: true,
      },
    }
  }

  // const meetings = await fetchResourceCollection(context, 'node--page')
  const menus = await drupal.getSiteMenus()
  const breadcrumb = await drupal.getBreadcrumb(path, true)

  // If we're not in preview mode and the node is not published,
  // Return page not found.
  if (!context.preview && !node.status) {
    console.error('Node not published', context)
    return {
      notFound: true,
      revalidate: 60,
    }
  }

  return {
    props: {
      breadcrumb,
      meetings: [],
      menus,
      node,
    },
    revalidate: 604800,
  }
}
