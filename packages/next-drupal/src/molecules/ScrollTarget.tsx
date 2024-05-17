import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

type ScrollTargetProps = {
  dependencies: any
}

const ScrollTarget: React.FC<ScrollTargetProps> = ({ dependencies }) => {
  const scrollTarget = useRef<HTMLDivElement>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useLayoutEffect(() => {
    const node = scrollTarget.current
    if (node !== null && !isFirstLoad) {
      node.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencies])

  useEffect(() => {
    setIsFirstLoad(false)
  }, [])

  return <div className="scroll-target" ref={scrollTarget} />
}

export default ScrollTarget
