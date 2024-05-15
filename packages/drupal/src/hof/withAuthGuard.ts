// HOF for adding common resources to the component by wrapping getServersideProps or getStaticProps

import { getServerSession } from 'next-auth'

import { authOptions } from '../lib/auth'

const getAccessTokenExpired = (session: any) => {
  return (session.access_token_expires || 0) * 1000 - Date.now() < 0
}

const withAuthGuard = (...fns: any) => {
  const getProps = fns[0]
  return async (context: any) => {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    )

    // Get props from the wrapped getServerSideProps
    const value = (getProps && (await getProps(context))) || {}

    const unauthorized = !session || getAccessTokenExpired(session)

    if (unauthorized) {
      if (!context.req?.url?.match(/^\/_next\/data\/.*.json.*$/)) {
        context.res.statusCode = 401
      }
      return {
        ...value,
        props: {
          ...(value.props || {}),
          error: {
            message: 'Unauthorized',
            statusCode: 401,
          },
        },
      }
    }

    return value
  }
}

export default withAuthGuard
