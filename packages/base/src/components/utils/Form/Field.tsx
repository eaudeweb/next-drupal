'use client'
import { useMemo } from 'react'

import cx from 'classnames'

import registry from '@edw/base/config'

function getWidgetDefault() {
  return registry.widgets.defaultWidget
}

function getWidgetByType(type?: keyof typeof registry.widgets.type) {
  return type ? registry.widgets.type[type] : null
}

export function Field({
  FieldProps = {},
  type,
  widget,
  ...props
}: any): React.ReactNode {
  const Widget = useMemo(
    () => getWidgetByType(type) || getWidgetDefault(),
    [type],
  )

  if (!Widget) {
    return null
  }

  return (
    <div
      {...FieldProps}
      className={cx(
        'widget',
        `${String(widget || type || 'text')}-widget`,
        {
          error: !!props.error,
        },
        FieldProps?.className,
      )}
    >
      <Widget {...props} />
    </div>
  )
}

export default Field
