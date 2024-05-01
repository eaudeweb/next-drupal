import React from 'react'

import { Breadcrumb } from 'antd'

import { DrupalLink } from '.'
import { type Breadcrumb as BreadcrumbType } from '../types'

interface BreadcrumbNavigationProps {
  breadcrumb: BreadcrumbType
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  breadcrumb,
}) => {
  const breadcrumbItems = breadcrumb?.items?.map((item) => ({
    title: item.url ? (
      <DrupalLink href={item.url}>{item.title}</DrupalLink>
    ) : (
      item.title
    ),
  }))

  return <Breadcrumb items={breadcrumbItems} />
}

export default BreadcrumbNavigation
