import type { FC, ReactNode } from 'react'

import './LoadingSegment.scss'
interface LoadingSegmentProps {
  busy: boolean
  children?: ReactNode
}

export const LoadingSegment: FC<LoadingSegmentProps> = ({ busy, children }) => {
  return (
    <div>
      <div
        className={'loading-segment' + (busy ? 'loading-segment--busy' : '')}
      >
        {children}
      </div>
    </div>
  )
}
