import type { ConfigRegistry } from '@edw/next-drupal/@types'

import breakpoints, { defaultBreakpoint } from './breakpoints'
import colors from './colors'
import { validationsMapping } from './Validations'
import { defaultWidget, widgetsMapping } from './Widgets'

const config: ConfigRegistry = {
  apiHandlers: [],
  settings: {
    breakpoints: {
      ...breakpoints,
      defaultBreakpoint,
    },
    colors,
  },
  validations: {
    ...validationsMapping,
  },
  widgets: {
    defaultWidget,
    ...widgetsMapping,
  },
}

export { breakpoints, colors, defaultBreakpoint }

export default config
