import { useEffect, useState } from 'react'

import { debounce } from '../helpers'

export const useIsElementOverflowing = (element: any) => {
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)

  useEffect(() => {
    const checkOverflow = () => {
      debounce(
        () => {
          if (element) {
            setIsOverflowing(
              element.offsetLeft + element.offsetWidth >
                document.documentElement.offsetWidth,
            )
          }
        },
        200,
        'checkOverflow',
      )
    }

    checkOverflow()

    window.addEventListener('resize', checkOverflow)

    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [element])

  return [isOverflowing]
}
