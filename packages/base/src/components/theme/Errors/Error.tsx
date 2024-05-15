import Error401 from './401'
import Error403 from './403'
import Error404 from './404'
import Error500 from './500'
import ErrorBoundary from './ErrorBoundary'

// @todo Miu: add type checks
export default function Error({ children, error }: any) {
  const { statusCode } = error || {}
  switch (statusCode) {
    case 401:
      return <Error401 />
    case 403:
      return <Error403 />
    case 404:
      return <Error404 />
    case 500:
      return <Error500 />
    default:
      return statusCode ? (
        <p>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </p>
      ) : (
        <ErrorBoundary>{children}</ErrorBoundary>
      )
  }
}
