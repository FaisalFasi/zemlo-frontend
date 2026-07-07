import type { AxiosRequestConfig } from "axios";

import { toApiClientError } from "../config/api-error";
import { axiosInstance } from "./axios-instance";

export async function axiosMutator<TData = unknown>(
  config: AxiosRequestConfig,
): Promise<TData> {
  try {
    const response = await axiosInstance.request<TData>(config);

    return response.data;
  } catch (error) {
    throw toApiClientError(error);
  }
}
