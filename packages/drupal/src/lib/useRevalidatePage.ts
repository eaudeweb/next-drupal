import { useEffect } from 'react'

import { useRouter } from 'next/router'

export const useRevalidatePage = (): void => {
  const router = useRouter()
  const { refresh, slug } = router.query

  useEffect(() => {
    const revalidate = async (): Promise<void> => {
      if ('refresh' in router.query) {
        try {
          const slugPath: string = Array.isArray(slug)
            ? slug.join('/')
            : slug || ''

          const revalidateUrl: string = `/api/revalidate?secret=${refresh}&slug=/${slugPath}`
          const response: Response = await fetch(revalidateUrl)

          if (!response.ok) {
            const errorBody = await response.json()
            throw new Error(
              `Revalidation failed with status: ${response.status}, Message: ${errorBody.message}`,
            )
          }
          if (response.ok) {
            console.log('Revalidation triggered successfully')
            router.replace(slugPath, undefined, { shallow: false })
          }
        } catch (error) {
          console.error('Revalidation error:', (error as Error).message)
        }
      }
    }

    revalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, router.query, slug])
}
