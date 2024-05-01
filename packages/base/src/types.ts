import type { ThemeConfig } from 'antd'
import type { ReactNode } from 'react'

import { NextApiRequest, NextApiResponse } from 'next'

export interface ApiHandlerDefinition {
  handler: (req: NextApiRequest, res: NextApiResponse) => void
  matcher: RegExp
}

export type ConfigRegistry = {
  [key: string]: any
  apiHandlers: ApiHandlerDefinition[]
}

export interface MenuEntry {
  children?: MenuEntry[]
  label: string
  to: string
}

export type AppState = Record<string, any>

export interface AppProps {
  children: ReactNode
  initialAppState: AppState
  theme: ThemeConfig
}

export interface DefaultLayoutProps {
  children: ReactNode
  error?: {
    message: string
    statusCode: number
  }
  footer: ReactNode
  header: ReactNode
}

export interface SiteLayoutProps {
  children: ReactNode
  footer: ReactNode
  header: ReactNode
}

export interface BreadcrumbEntry {
  title: string
  url: string
}

// https://test.admin.multilateralfund.edw.ro/api/v1/breadcrumb?path=/page/test-paragraphs
export interface Breadcrumb {
  items: BreadcrumbEntry[]
  path: string
}

export type NotificationMessageLevel = 'error' | 'info' | 'warn'
