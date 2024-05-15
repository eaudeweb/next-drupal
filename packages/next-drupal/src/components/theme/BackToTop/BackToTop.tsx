import type { ButtonProps as AntdButtonProps } from 'antd'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ArrowUpOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export interface BackToTopProps {
  ButtonProps?: AntdButtonProps
  element?: Element | false | null
  minHeight?: number
  offset?: number
  title?: false | string
}

export function BackTotop({
  ButtonProps,
  element,
  minHeight = 2000,
  offset = 200,
  title,
}: BackToTopProps) {
  const [active, setActive] = useState(false)
  const isScrolling = useRef(false)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const scrollHeight = document.documentElement.scrollHeight
    let elementY = 0
    if (element) {
      elementY = (element as HTMLElement).offsetTop
    }
    if (scrollHeight > minHeight && scrollY > offset + elementY) {
      setActive(true)
    } else {
      setActive(false)
    }
    isScrolling.current = true
  }, [element, minHeight, offset])

  const handleScrollEnd = useCallback(() => {
    isScrolling.current = false
  }, [])

  const triggerScroll = useCallback(() => {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ behavior: 'smooth', top: 0 })
    }
  }, [element])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scrollend', handleScrollEnd)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', handleScroll)
    }
  }, [handleScroll, handleScrollEnd, triggerScroll])

  return (
    active && (
      <div className="back-to-top">
        <Button
          type="primary"
          onClick={() => {
            if (isScrolling.current) {
              setTimeout(() => {
                triggerScroll()
              }, 400)
            } else {
              triggerScroll()
            }
          }}
          {...ButtonProps}
        >
          {title || 'Back to top'} <ArrowUpOutlined />
        </Button>
      </div>
    )
  )
}

export default BackTotop
