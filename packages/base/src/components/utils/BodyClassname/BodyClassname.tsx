import { useEffect } from 'react'

export interface BodyClassnameProps {
  className: string
}

export function BodyClassname({ className }: BodyClassnameProps) {
  useEffect(() => {
    document.body.classList.add(className)
    return () => {
      document.body.classList.remove(className)
    }
  }, [className])
  return null
}

export default BodyClassname
