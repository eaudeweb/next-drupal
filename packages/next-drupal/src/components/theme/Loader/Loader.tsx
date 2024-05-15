import React, { useEffect, useState } from 'react'

import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useRouter } from 'next/router'

export const Loader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url: string) => {
      const newPathname = new URL(url, window.location.href).pathname
      const currentPathname = router.asPath.split('?')[0]

      if (newPathname !== currentPathname) {
        setIsLoading(true)
      }
    }

    const handleComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  if (!isLoading) return null

  return <Spin fullscreen={true} indicator={<LoadingOutlined spin />} />
}
