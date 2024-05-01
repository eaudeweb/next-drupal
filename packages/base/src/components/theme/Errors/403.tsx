import { Col, Row } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

import { DrupalLink } from '@edw/base/molecules/DrupalLink'

export default function Error401(): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="error-403">
      <Row align="middle" justify="center">
        <Col>
          <div className="global">
            <h1>403</h1>
            <p>You are forbidden from accessing this page.</p>
            <p>
              Click to get to{' '}
              <DrupalLink
                href={`/user/login${pathname !== '/user/login' ? `?redirect=${pathname}` : ''}`}
              >
                login screen
              </DrupalLink>{' '}
              or click to get to the{' '}
              <DrupalLink
                onClick={(e) => {
                  e.preventDefault()
                  router.back()
                }}
              >
                previous location
              </DrupalLink>
              .
            </p>
          </div>
        </Col>
      </Row>
    </div>
  )
}
