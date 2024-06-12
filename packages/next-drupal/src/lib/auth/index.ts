/* eslint-disable turbo/no-undeclared-env-vars */
import type { NextAuthOptions, Session } from 'next-auth'

import { jwtDecode } from 'jwt-decode'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import {
  BuiltInProviderType,
  RedirectableProviderType,
} from 'next-auth/providers/index'
import {
  LiteralUnion,
  signIn as NextAuthSignIn,
  signOut as NextAuthSignOut,
  SignInAuthorizationParams,
  SignInOptions,
  SignOutParams,
} from 'next-auth/react'

import { drupal } from '@edw/next-drupal/lib/drupal'
import DrupalCredentialsProvider from './providers/DrupalCredentials'

let broadcastChannel: BroadcastChannel | null = null

function postMessage(event: string) {
  broadcast().postMessage({
    event,
  })
}

export function broadcast() {
  if (typeof BroadcastChannel === 'undefined') {
    return {
      addEventListener: () => {},
      postMessage: () => {},
      removeEventListener: () => {},
    }
  }

  if (broadcastChannel === null) {
    broadcastChannel = new BroadcastChannel('next-auth')
  }

  return broadcastChannel
}

export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
>(
  provider?: LiteralUnion<
    P extends RedirectableProviderType
      ? BuiltInProviderType | P
      : BuiltInProviderType
  >,
  options?: { broadcast?: boolean } & SignInOptions,
  authorizationParams?: SignInAuthorizationParams,
) {
  const result = await NextAuthSignIn(provider, options, authorizationParams)
  if (options?.broadcast ?? true) {
    postMessage('signIn')
  }
  return result
}

export async function signOut<R extends boolean = true>(
  options?: { broadcast?: boolean } & SignOutParams<R>,
) {
  const result = await NextAuthSignOut(options)
  if (options?.broadcast ?? true) {
    postMessage('signOut')
  }
  return result
}

async function refreshAccessToken(token: JWT) {
  const clientId = process.env.DRUPAL_CLIENT_ID || ''
  const clientSecret = process.env.DRUPAL_CLIENT_SECRET || ''
  const oauthUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
    ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`
    : ''

  const response = await fetch(oauthUrl, {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token || '',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: {
        message: response.statusText,
        statusCode: response.status,
      },
    }
  }

  return {
    ...token,
    access_token: data.access_token,
    expires_in: Date.now() + data.expires_in * 1000,
    // expires_in: Date.now() + 5 * 1000,
    refresh_token: data.refresh_token,
  }
}

export const authOptions = {
  callbacks: {
    async jwt({ account, token, user }) {
      let data: any = {}
      try {
        data = jwtDecode(user?.access_token || token?.access_token || '')
      } catch (e) {
        console.log(e)
      }
      // Initial sign in
      if (account && user) {
        return {
          access_token: user.access_token,
          email: data.mail || user.email,
          expires_in: Date.now() + (user.expires_in || 0) * 1000,
          // expires_in: Date.now() + 5 * 1000,
          name: user.name,
          permissions: data.permissions,
          refresh_token: user.refresh_token,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expires_in || 0)) {
        return {
          ...token,
          email: data.mail,
          permissions: data.permissions,
        }
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.error) {
        drupal.session = null
        return {
          ...session,
          error: token.error,
        }
      }

      session.user = {
        email: token.email,
        name: token.name,
        permissions: (token.permissions || {}) as Record<string, boolean>,
      }
      session.access_token = token.access_token
      session.access_token_expires = token.expires_in

      drupal.session = session

      return session
    },
  },
  providers: [DrupalCredentialsProvider()],
  secret: process.env.NEXTAUTH_SECRET || '',
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 Days
    strategy: 'jwt',
  },
} satisfies NextAuthOptions

export { default as SessionProvider } from './SessionProvider'

export default NextAuth(authOptions)
