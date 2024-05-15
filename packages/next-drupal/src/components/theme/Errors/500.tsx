import { Col, Row } from 'antd'

export default function Error500(): JSX.Element {
  return (
    <div className="error-500">
      <Row align="middle" justify="center">
        <Col>
          <div className="global">
            <h1>500</h1>
            <p>Oops! Something went wrong.</p>
            <p>We&apos;re really sorry for the inconvenience.</p>
          </div>
        </Col>
      </Row>
    </div>
  )
}
