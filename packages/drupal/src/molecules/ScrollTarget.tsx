import { useLayoutEffect, useRef } from 'react'

type ScrollTargetProps = {
  dependencies: any[]
}

const ScrollTarget: React.FC<ScrollTargetProps> = ({ dependencies }) => {
  const scrollTarget = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const node = scrollTarget.current
    if (node !== null) {
      node.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [dependencies])

  return <div ref={scrollTarget}></div>
}

export default ScrollTarget
