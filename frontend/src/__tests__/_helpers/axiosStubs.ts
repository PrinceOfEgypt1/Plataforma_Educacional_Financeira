/**
 * Helpers tipados para construir respostas/erros axios sem `any`.
 *
 * MotivaÃ§Ã£o: o `AxiosResponse` exige `headers` (subtipo de
 * `RawAxiosResponseHeaders | AxiosHeaders`) e `config`
 * (`InternalAxiosRequestConfig`). Em E01 esses campos foram inflados com
 * placeholders inflados. Aqui construÃ­mos ambos usando as classes reais da lib,
 * preservando tipagem forte e sem cast amplo.
 */
import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type RawAxiosResponseHeaders,
} from "axios";

function toAxiosHeaders(headerMap: object | undefined): AxiosHeaders {
  const headers = new AxiosHeaders();

  for (const [key, value] of Object.entries(headerMap ?? {})) {
    if (value !== undefined && value !== null) {
      headers.set(key, String(value));
    }
  }

  return headers;
}

export function makeAxiosConfig(
  headerMap: RawAxiosResponseHeaders = {},
): InternalAxiosRequestConfig {
  return { headers: toAxiosHeaders(headerMap) };
}

export function makeAxiosResponse<T>(
  status: number,
  data: T,
  headerMap: RawAxiosResponseHeaders = {},
  statusText = status === 200 ? "OK" : "",
): AxiosResponse<T> {
  const headers = toAxiosHeaders(headerMap);
  return {
    status,
    data,
    statusText,
    headers,
    config: { headers },
  };
}

export function makeAxiosError(
  status: number,
  data: unknown,
  headerMap: RawAxiosResponseHeaders = {},
  message = String(status),
): AxiosError {
  const err = new AxiosError(message);
  err.response = makeAxiosResponse<unknown>(status, data, headerMap, "");
  return err;
}
