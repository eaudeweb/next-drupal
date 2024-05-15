import { Col, Row } from 'antd'

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
        <div className={`error-${statusCode}`}>
          <Row align="middle" justify="center">
            <Col>
              <div className="global">
                <h1>{statusCode}</h1>
                <p>
                  {statusCode
                    ? `An error occurred on server`
                    : 'An error occurred on client'}
                </p>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <ErrorBoundary>{children}</ErrorBoundary>
      )
  }
}
