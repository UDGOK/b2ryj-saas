import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  toResponse() {
    return NextResponse.json(
      {
        error: this.message,
        code: this.code,
        ...(this.details && { details: this.details })
      },
      { status: this.status }
    )
  }
}

export const ERRORS = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'You must be logged in to access this resource',
    status: 401
  },
  FORBIDDEN: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'You do not have permission to access this resource',
    status: 403
  },
  NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    message: 'The requested resource was not found',
    status: 404
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid request data',
    status: 400
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    status: 500
  }
} as const

export function createErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return error.toResponse()
  }

  if (error instanceof Error) {
    return new ApiError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      { stack: error.stack }
    ).toResponse()
  }

  return new ApiError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500
  ).toResponse()
}
