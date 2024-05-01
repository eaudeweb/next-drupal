import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Layout } from 'antd'
import cx from 'classnames'

import { Container, type DefaultLayoutProps } from '@edw/base'
import { useIsHomepage } from '@edw/base/lib/useIsHomepage'
import { EnvironmentIndicator, UserToolbar } from '@edw/base/molecules'

import Error from '../Errors/Error'

const { Content, Footer, Header } = Layout

export function DefaultLayout({
  children,
  error,
  footer,
  header,
}: DefaultLayoutProps): React.JSX.Element {
  const isHomepage = useIsHomepage()
  return (
    <>
      <Layout>
        <ReactQueryDevtools initialIsOpen={false} />
        <EnvironmentIndicator />
        <UserToolbar />
      </Layout>
      <Layout className={cx('default-layout', { 'is-homepage': isHomepage })}>
        <Header>{header}</Header>
        <Content>
          <Container>
            <Error error={error}>{children}</Error>
          </Container>
        </Content>
        <Footer>{footer}</Footer>
      </Layout>
    </>
  )
}

export default DefaultLayout
