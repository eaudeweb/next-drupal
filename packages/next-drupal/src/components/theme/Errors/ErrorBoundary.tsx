import React from 'react'

type ErrorBoundaryState = {
  error: any
  hasError: boolean
}

class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState

  constructor(props: any) {
    super(props)

    this.state = { error: null, hasError: false }
  }
  static getDerivedStateFromError(error: unknown) {
    return { error, hasError: true }
  }
  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    return (this.props as any).children
  }
}

export default ErrorBoundary
