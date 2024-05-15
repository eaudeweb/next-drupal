import React from 'react'

import Link from 'next/link'

import {
  isInternalUrl,
  removeDrupalLinkPrefixes,
} from '@edw/next-drupal/helpers/Url'

interface DrupalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  passHref?: boolean
}

export const DrupalLink: React.FC<DrupalLinkProps> = ({
  children,
  href = '',
  ...props
}) => {
  if (!href || href === '<none>') {
    return (
      <a href="#" {...props}>
        {children}
      </a>
    )
  }

  const strippedDrupalPrefix = removeDrupalLinkPrefixes(href)
  const isInternal = isInternalUrl(strippedDrupalPrefix)

  if (isInternal) {
    return (
      <Link href={strippedDrupalPrefix} {...props}>
        {children}
      </Link>
    )
  } else {
    return (
      <a href={strippedDrupalPrefix} {...props}>
        {children}
      </a>
    )
  }
}

export default DrupalLink
