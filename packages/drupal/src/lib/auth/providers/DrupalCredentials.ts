import Credentials, {
  CredentialInput,
  CredentialsConfig,
} from 'next-auth/providers/credentials'

type UserCredentialsConfig<C extends Record<string, CredentialInput>> = Partial<
  Omit<CredentialsConfig<C>, 'options'>
> &
  Pick<CredentialsConfig<C>, 'authorize' | 'credentials'>

export default function DrupalCredentials<
  C extends Record<string, CredentialInput> = Record<string, CredentialInput>,
>(options?: Partial<UserCredentialsConfig<C>>): CredentialsConfig<C> {
  return Credentials<any>({
    authorize: async (credentials) => {
      const clientId = process.env.DRUPAL_CLIENT_ID || ''
      const clientSecret = process.env.DRUPAL_CLIENT_SECRET || ''
      const oauthUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
        ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`
        : ''
      const { password, username } = credentials || {}

      if (!password || !username) {
        return null
      }

      const response = await fetch(oauthUrl, {
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'password',
          password: password,
          username: username,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      return {
        ...data,
        email: username,
        name: username,
      }
    },
    credentials: {
      password: { label: 'Password', type: 'password' },
      username: { label: 'Username', placeholder: 'Username', type: 'text' },
    },
    name: 'Drupal',
    ...(options || {}),
  })
}
