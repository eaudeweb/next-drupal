import { useEffect, useState } from 'react'

export function withClientOnly(SomeComponent: React.ComponentType<any>) {
  function WrappedComponent(props: any) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      setIsClient(true)
    }, [])

    return isClient ? <SomeComponent {...props} /> : null
  }

  const name = SomeComponent.displayName || SomeComponent.name || 'Component'
  WrappedComponent.displayName = `WithClientOnly<${name}>`

  return WrappedComponent
}
