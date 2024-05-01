// @ts-nocheck
// @todo Miu: remove ts-nocheck
import Jsona from 'jsona'

import DrupalClient from './DrupalClient'

const dataFormatter = new Jsona()

export const drupal: DrupalClient = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? '/dummy',
  {
    auth: () => {
      return drupal.session?.access_token
        ? `Bearer ${drupal.session?.access_token}`
        : ''
    },
    previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
    withAuth: true,
  },
)

export const deserialize = (body: any, options?: any) => {
  if (!body) return null
  return dataFormatter.deserialize(body, options)
}
