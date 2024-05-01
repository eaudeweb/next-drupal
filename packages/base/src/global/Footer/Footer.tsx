import type { FC } from 'react'

import { Col, Row } from 'antd'

import { Container, DrupalLink } from '@edw/base'

import './Footer.scss'
interface FooterProps {
  children: React.ReactNode
  containerSize?: 'full-width' | 'header' | 'large' | 'medium' | 'small'
  logo: React.ReactNode
}

export const Footer: FC<FooterProps> = ({ children, containerSize, logo }) => {
  return (
    <Container className="footer" size={containerSize ?? 'large'}>
      <Row>
        <Col className="logo-col">
          <DrupalLink href="/">{logo}</DrupalLink>
        </Col>
        <Col className="content-col">{children}</Col>
      </Row>
    </Container>
  )
}

// TODO: test cases footer & other simple reusable components
