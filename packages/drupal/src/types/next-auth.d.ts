import { Session as NextAuthSession, User as NextAuthUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends NextAuthUser {
    access_token?: string
    expires_in?: number
    refresh_token?: string
  }

  interface Session extends NextAuthSession {
    access_token?: string
    access_token_expires?: number
    error?: {
      message: string
      statusCode: number
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string
    error?: {
      message: string
      statusCode: number
    }
    expires_in?: number
    refresh_token?: string
  }
}
