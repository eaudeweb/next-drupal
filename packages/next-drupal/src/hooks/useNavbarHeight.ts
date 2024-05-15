import { useEffect, useState } from 'react'

export const useNavbarHeight = (element: any) => {
  const [navbarHeight, setNavbarHeight] = useState<number>(0)

  useEffect(() => {
    const computeNavbarHeight = () => {
      if (element) {
        const height = element?.clientHeight
        setNavbarHeight(height)
      }
    }

    const resizeObserver = new ResizeObserver(computeNavbarHeight)

    if (element) {
      resizeObserver.observe(element)
    }

    computeNavbarHeight() // Initial check

    return () => {
      resizeObserver.disconnect()
    }
  }, [element])

  return [navbarHeight]
}
