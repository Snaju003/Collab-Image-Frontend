import type { useAuth } from "@clerk/react"

import { apiClient, type RequestConfig } from "@/lib/api-client"

type ClerkGetToken = ReturnType<typeof useAuth>["getToken"]

let clerkGetToken: ClerkGetToken | null = null

function setApiAuthTokenGetter(getToken: ClerkGetToken) {
  clerkGetToken = getToken
}

apiClient.addRequestInterceptor(async (config: RequestConfig) => {
  if (!clerkGetToken) {
    return config
  }

  const token = await clerkGetToken()

  if (!token) {
    return config
  }

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  }
})

export { setApiAuthTokenGetter }
