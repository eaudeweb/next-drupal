import { useEffect, useState } from 'react'

export const useIsElementOverflowing = (element: any) => {
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (element) {
        setIsOverflowing(element.scrollWidth > element.clientWidth)
      }
    }

    const resizeObserver = new ResizeObserver(checkOverflow)

    if (element) {
      resizeObserver.observe(element)
    }

    checkOverflow() // Initial check

    return () => {
      resizeObserver.disconnect()
    }
  }, [element])

  return [isOverflowing]
}
