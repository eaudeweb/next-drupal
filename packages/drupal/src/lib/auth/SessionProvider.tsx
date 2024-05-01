import { useEffect } from 'react'

import {
  SessionProvider as NextSessionProvider,
  SessionContextValue,
  signOut,
  useSession,
} from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { usePrevious } from '@edw/base/hooks'

import { drupal } from '../drupal'

function SessionProviderWorker() {
  const session = useSession()
  const router = useRouter()
  const prevSession = usePrevious<SessionContextValue>(session)

  useEffect(() => {
    drupal.session = session.data
    if (session.data?.error) {
      signOut()
      return
    }
    if (
      session.status === 'unauthenticated' &&
      prevSession?.status === 'authenticated'
    ) {
      router.refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return null
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
