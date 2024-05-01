import { Button, Col, Row } from 'antd'

import { DrupalLink } from '@edw/base/molecules/DrupalLink'

export default function Error404(): JSX.Element {
  return (
    <div className="error-404">
      <Row align="middle" justify="center">
        <Col>
          <div className="global">
            <h1>404</h1>
            <p>The page you are looking for could not be found.</p>
            <Button type="primary">
              <DrupalLink href="/">Return Home</DrupalLink>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}
