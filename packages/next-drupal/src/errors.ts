interface MaybeHasCause {
  cause?: any
}

export class BackendError extends Error {
  cause: any
  statusCode: number

  constructor(message: string, options?: MaybeHasCause) {
    super(message)

    this.name = 'BackendError'
    this.statusCode = 500

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError)
    }
    if (options?.cause) {
      this.cause = options.cause
    }
  }
}

export class NotFoundError extends BackendError {
  constructor(message?: string, options?: MaybeHasCause) {
    super(message || 'Not found', options)

    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

export class UnauthorizedError extends BackendError {
  constructor(message?: string, options?: MaybeHasCause) {
    super(message || 'Unauthorized', options)

    this.name = 'UnauthorizedError'
    this.statusCode = 401
  }
}

export class ForbiddenError extends BackendError {
  constructor(message?: string, options?: MaybeHasCause) {
    super(message || 'Forbidden', options)

    this.name = 'ForbiddenError'
    this.statusCode = 403
  }
}
