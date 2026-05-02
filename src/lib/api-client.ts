type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig
type ResponseInterceptor = (response: Response) => Promise<Response> | Response

type RequestConfig = RequestInit & {
  url: string
}

class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  async request<T>(config: RequestConfig): Promise<T> {
    let finalConfig = config

    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig)
    }

    const { url, ...requestInit } = finalConfig
    let response = await fetch(url, requestInit)

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response)
    }

    const data = await parseResponseBody<T>(response)

    if (!response.ok) {
      throw new ApiError(getApiErrorMessage(data), response.status, data)
    }

    return data
  }
}

async function parseResponseBody<T>(response: Response) {
  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

function getApiErrorMessage(data: unknown) {
  if (isRecord(data) && typeof data.message === "string") {
    return data.message
  }

  return "Something went wrong. Please try again."
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

const apiClient = new ApiClient()

apiClient.addRequestInterceptor((config) => ({
  ...config,
  headers: {
    ...(config.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...config.headers,
  },
}))

apiClient.addResponseInterceptor((response) => response)

export { ApiError, apiClient }
export type { RequestConfig }
