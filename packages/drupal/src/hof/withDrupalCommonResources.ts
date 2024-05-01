// HOF for adding common resources to the component by wrapping getServersideProps or getStaticProps
// e.g. export const getServerSideProps = withDrupalCommonResources(null)

import { drupal } from '../lib/drupal'

const withDrupalCommonResources = (...fns: any) => {
  const getProps = fns[0]
  return async (context: any) => {
    try {
      // Get common resources
      const path = drupal.getPathFromContext(context)
      const menus = await drupal.getSiteMenus()
      const breadcrumb = await drupal.getBreadcrumb(path, true)
      // Get props from the wrapped getServerSideProps
      const value = (getProps && (await getProps(context))) || {}

      return {
        ...value,
        props: {
          ...(value.props || {}),
          breadcrumb,
          menus,
        },
      }
    } catch (e: any) {
      if (!context.req?.url?.match(/^\/_next\/data\/.*.json.*$/)) {
        context.res.statusCode = e.statusCode || 500
      }
      return {
        props: {
          error: {
            message: e.message || 'Something went wrong',
            statusCode: e.statusCode || 500,
          },
        },
      }
    }
  }
}

export default withDrupalCommonResources
