import type { AxiosError, AxiosRequestConfig } from "axios";

import { axiosInstance } from "./axios-instance";

export type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function getApiErrorMessage(error: AxiosError<ApiErrorResponse>) {
  const responseMessage = error.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(", ");
  }

  if (typeof responseMessage === "string") {
    return responseMessage;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  return error.message || "Something went wrong.";
}

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

export async function axiosMutator<TResponse>(
  config: AxiosRequestConfig,
): Promise<TResponse> {
  try {
    const response = await axiosInstance.request<TResponse>(config);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    throw new ApiClientError(
      getApiErrorMessage(axiosError),
      axiosError.response?.status,
      axiosError.response?.data,
    );
  }
}
