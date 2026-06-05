export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
