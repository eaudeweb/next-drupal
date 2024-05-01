'use client'

import { usePathname } from 'next/navigation'

export function useIsHomepage() {
  const pathname = usePathname()
  return pathname === '/'
}
