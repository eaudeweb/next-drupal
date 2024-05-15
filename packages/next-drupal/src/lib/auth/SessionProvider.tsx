import { useCallback, useEffect } from 'react'

import { notification } from 'antd'
import {
  SessionProvider as NextSessionProvider,
  useSession,
} from 'next-auth/react'

import { DrupalLink } from '@edw/next-drupal/components/ui'

import { broadcast } from '.'
import { drupal } from '../drupal'

function SessionProviderWorker() {
  const session = useSession()
  const [api, contextHolder] = notification.useNotification()

  const handle = useCallback(
    (e: MessageEvent) => {
      if (['signIn', 'signOut'].includes(e.data.event)) {
        api.open({
          description: (
            <>
              You {e.data.event === 'signIn' ? 'signed in' : 'signed out'} with
              another tab or window.{' '}
              <DrupalLink
                onClick={(e) => {
                  e.preventDefault()
                  window.location.reload()
                }}
              >
                Reload
              </DrupalLink>{' '}
              to refresh your session.
            </>
          ),
          duration: 0,
          message: 'Session Update',
        })
        // window.location.reload()
      }
    },
    [api],
  )

  useEffect(() => {
    broadcast().addEventListener('message', handle)
    return () => broadcast().removeEventListener('message', handle)
  }, [handle])

  useEffect(() => {
    drupal.session = session.data
  }, [session])

  return contextHolder
}

export default function SessionProvider({ children, initialSession }: any) {
  return (
    <NextSessionProvider
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
      session={initialSession}
    >
      <SessionProviderWorker />
      {children}
    </NextSessionProvider>
  )
}
