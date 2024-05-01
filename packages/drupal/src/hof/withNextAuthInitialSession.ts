// HOF for adding common resources to the component by wrapping getInitialProps
// e.g. export const getInitialProps = withDrupalSession(null)

import { getServerSession } from 'next-auth'

import { authOptions } from '../lib/auth'
import { drupal } from '../lib/drupal'

const withNextAuthInitialSession = (...fns: any) => {
  const getProps = fns[0]
  return async (context: any) => {
    const isGssp = !context.ctx
    try {
      const ctx = context.ctx || context
      // Trigger the session to be populated on the server
      // This will refresh the access token if it has expired before drupal makes a request
      const initialSession = await getServerSession(
        ctx.req,
        ctx.res,
        authOptions,
      )
      drupal.session = initialSession
      // Get props from the wrapped getInitialProps
      const value = (getProps && (await getProps(context))) || {}

      return {
        ...value,
        pageProps: {
          ...(value.pageProps || {}),
          initialSession,
        },
      }
    } catch (e: any) {
      if (!context.req?.url?.match(/^\/_next\/data\/.*.json.*$/)) {
        context.res.statusCode = e.statusCode || 500
      }
      return {
        [isGssp ? 'props' : 'pageProps']: {
          error: {
            message: e.message || 'Something went wrong',
            statusCode: e.statusCode || 500,
          },
        },
      }
    }
  }
}

export default withNextAuthInitialSession
