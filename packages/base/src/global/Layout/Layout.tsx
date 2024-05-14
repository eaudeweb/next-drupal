import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider, Layout, notification } from 'antd'

import { Container } from '@edw/base'
import Error from '@edw/base/components/theme/Errors/Error'
import { AppStateProvider } from '@edw/base/contexts'
import { queryClient } from '@edw/base/helpers'

import { useIsHomepage } from '../../lib/useIsHomepage'
import { EnvironmentIndicator } from '../../molecules'

import './Layout.scss'

const { Content, Footer, Header } = Layout

export function SiteLayout({
  appState,
  children,
  footer,
  header,
  theme,
}: any): React.JSX.Element {
  const [, contextHolder] = notification.useNotification()
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider value={appState}>
        <ConfigProvider theme={theme}>
          {contextHolder}
          <Layout>
            <ReactQueryDevtools initialIsOpen={false} />
            <EnvironmentIndicator />
          </Layout>
          <Layout
            className={`site-layout${useIsHomepage() ? ' is-homepage' : ''}`}
          >
            <Header>{header}</Header>
            <Content>
              <Container>
                <Error>{children}</Error>
              </Container>
            </Content>
            <Footer>{footer}</Footer>
          </Layout>
        </ConfigProvider>
      </AppStateProvider>
    </QueryClientProvider>
  )
}

export default SiteLayout
