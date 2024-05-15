'use client'
import { useMemo } from 'react'

import cx from 'classnames'

import config from '@edw/next-drupal/config'

function getWidgetDefault() {
  return config.widgets.defaultWidget
}

function getWidgetByType(type?: keyof typeof config.widgets.type) {
  return type ? config.widgets.type[type] : null
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
