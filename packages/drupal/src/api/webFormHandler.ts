import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const body = JSON.stringify(req.body)
    const url = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/webform_rest/submit`
    try {
      const apiResponse = await fetch(url.toString(), {
        body: body,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (apiResponse.ok) {
        const data = await apiResponse.json()
        return res.status(200).json(data)
      } else {
        return res.status(apiResponse.status).json({
          message: apiResponse.statusText,
        })
      }
    } catch (error) {
      console.error('API request error:', error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
