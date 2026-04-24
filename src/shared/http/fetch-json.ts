import { AppError } from '../errors/app-error';

export class HttpRequestError extends AppError {
  constructor(
    readonly status: number,
    readonly url: string,
    readonly responseBody?: string,
  ) {
    super('EXTERNAL_SERVICE_ERROR', `HTTP request failed with status ${status}`, {
      status,
      url,
    });
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text().catch(() => undefined);

    throw new HttpRequestError(response.status, url, body);
  }

  return response.json() as Promise<T>;
}