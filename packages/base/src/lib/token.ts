export async function refreshAccessToken(token: any) {
  try {
    const formData = new URLSearchParams()

    const clientId = process?.env?.DRUPAL_CLIENT_ID
      ? process.env.DRUPAL_CLIENT_ID
      : ''

    const clientSecret = process?.env?.DRUPAL_CLIENT_SECRET
      ? process.env.DRUPAL_CLIENT_SECRET
      : ''

    formData.append('grant_type', 'refresh_token')
    formData.append('client_id', clientId)
    formData.append('client_secret', clientSecret)
    formData.append('refresh_token', token.refreshToken as string)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
      {
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to refresh access token')
    }

    const data = await response.json()

    const expiresAt = Date.now() + data.expires_in * 1000

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: expiresAt,
      refreshToken: data.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('RefreshAccessTokenError', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}
