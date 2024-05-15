import type { AppState } from '@edw/next-drupal/@types'

import React from 'react'

import { AppStateContext } from '@edw/next-drupal/contexts/AppState'

export const useAppState = (): AppState => {
  const context = React.useContext(AppStateContext)

  if (!context) {
    // eslint-disable-next-line no-console
    console.warn(
      "The `useAppState` hook must be used inside the <AppStateProvider> component's context.",
    )
  }

  return context
}
