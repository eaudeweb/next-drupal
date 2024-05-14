import type { ConfigRegistry } from './types'

import { validationsMapping } from './config/Validations'
import { defaultWidget, widgetsMapping } from './config/Widgets'

const registry: ConfigRegistry = {
  apiHandlers: [],
  validationsMapping: {
    ...validationsMapping,
  },
  widgets: {
    defaultWidget,
    ...widgetsMapping,
  },
}

export default registry
