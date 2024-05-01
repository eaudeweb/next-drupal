import type { FC, ReactNode } from 'react'

import toggles from 'classnames'

import './Container.scss'

interface ContainerHTMLAttributes extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  size?: 'full-width' | 'header' | 'large' | 'medium' | 'small'
}

export const Container: FC<ContainerHTMLAttributes> = ({
  children,
  className = '',
  size,
  ...props
}) => {
  return (
    <div
      className={toggles({
        [`container-${size}`]: size,
        [className]: className,
        container: true,
      })}
      {...props}
    >
      {children}
    </div>
  )
}
