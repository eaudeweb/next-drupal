import React from 'react'

import './EnvironmentIndicator.scss'

type CustomProperties = {
  '--env-indicator-bg-color'?: string
  '--env-indicator-fg-color'?: string
}

export const EnvironmentIndicator: React.FC = () => {
  const environmentName = process.env.NEXT_PUBLIC_ENVIRONMENT_INDICATOR_NAME
  const backgroundColor = process.env.NEXT_PUBLIC_ENVIRONMENT_INDICATOR_BG_COLOR
  const foregroundColor = process.env.NEXT_PUBLIC_ENVIRONMENT_INDICATOR_FG_COLOR

  const style: CustomProperties & React.CSSProperties = {
    '--env-indicator-bg-color': backgroundColor,
    '--env-indicator-fg-color': foregroundColor,
  }

  if (!environmentName) return null

  return (
    <div className="environment-indicator-container" style={style}>
      {environmentName}
    </div>
  )
}
