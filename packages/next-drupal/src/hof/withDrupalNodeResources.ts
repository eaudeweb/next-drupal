// HOF for adding common resources to the component by wrapping getServersideProps or getStaticProps
// e.g. export const getServerSideProps = withDrupalNodeResources(null)

import { getDrupalResourceFromContext } from '../lib/content'

const withDrupalNodeResources = (...fns: any) => {
  const getProps = fns[0]

  return async (context: any) => {
    let node: any

    // Get props from the wrapped getServerSideProps
    const value = (getProps && (await getProps(context))) || {}

    const slug = context?.params?.slug as string[]

    try {
      node = await getDrupalResourceFromContext(context)
    } catch (e: any) {
      if (!context.req?.url?.match(/^\/_next\/data\/.*.json.*$/)) {
        context.res.statusCode = e.statusCode || 500
      }
      return {
        ...value,
        props: {
          ...(value.props || {}),
          error: {
            message: e.message || 'Something went wrong',
            statusCode: e.statusCode || 500,
          },
        },
      }
    }

    const requestedPath = slug ? '/' + slug.join('/') : null
    const canonicalPath = node.path && node.path.alias ? node.path.alias : null

    // Redirect to the canonical URL if the requested path and canonical path are defined and different
    if (requestedPath && canonicalPath && requestedPath !== canonicalPath) {
      return {
        redirect: {
          destination: canonicalPath,
          permanent: true,
        },
      }
    }

    return {
      ...value,
      props: {
        ...(value.props || {}),
        meetings: [],
        node,
      },
    }
  }
}

export default withDrupalNodeResources
