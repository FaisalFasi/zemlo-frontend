import type { AxiosError } from "axios";

export type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === "object" && value !== null;
}

export function getApiErrorMessage(error: AxiosError): string {
  const responseData = error.response?.data;

  if (isApiErrorResponse(responseData)) {
    const responseMessage = responseData.message;

    if (Array.isArray(responseMessage)) {
      return responseMessage.join(", ");
    }

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (typeof responseData.error === "string" && responseData.error.trim()) {
      return responseData.error;
    }
  }

  return error.message || "Something went wrong.";
}

export function toApiClientError(error: unknown): ApiClientError {
  const axiosError = error as AxiosError;

  return new ApiClientError(
    getApiErrorMessage(axiosError),
    axiosError.response?.status,
    axiosError.response?.data,
  );
}