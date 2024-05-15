import { Col, Flex, Row } from 'antd'

import {
  AppState,
  BreadcrumbNavigation,
  Container,
  useAppState,
} from '@edw/base'

import './BasicHeader.scss'

// Define interface for props
interface BasicHeaderProps {
  title: string
}

export const BasicHeader = ({ title }: BasicHeaderProps) => {
  // useAppState hook with AppState interface
  const appState: AppState = useAppState()
  const { breadcrumb } = appState

  return (
    <div className="basic-header full-width">
      <Container>
        <Flex justify="space-between">
          <BreadcrumbNavigation breadcrumb={breadcrumb} />
        </Flex>
      </Container>
      <Container className="basic-header__title">
        <Row align="middle" justify="center">
          <Col>{title && <h1>{title}</h1>}</Col>
        </Row>
      </Container>
    </div>
  )
}
