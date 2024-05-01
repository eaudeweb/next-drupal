import type { NextApiRequest, NextApiResponse } from 'next'

import { drupal } from '@edw/drupal/lib/drupal'

type DrupalSearchQuery = {
  apipath: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const body = req.body ? JSON.parse(req.body) : {}
    const { apipath } = req.query as DrupalSearchQuery
    const [, index] = apipath

    const resp = await drupal.getSearchAutocomplete(index, {
      deserialize: false,
      params: body,
    })

    return res.json(resp)
  } catch (error) {
    return res.status(400).json((error as Error).message)
  }
}
