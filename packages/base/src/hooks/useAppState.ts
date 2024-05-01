import type { AppState } from '../types'

import React from 'react'

import { AppStateContext } from '@edw/base/contexts/AppState'

const useAppState = (): AppState => {
  const context = React.useContext(AppStateContext)

  if (!context) {
    // eslint-disable-next-line no-console
    console.warn(
      "The `useAppState` hook must be used inside the <AppStateProvider> component's context.",
    )
  }

  return context
}

export default useAppState
