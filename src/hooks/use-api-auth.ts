import { useAuth } from "@clerk/react"
import { useEffect } from "react"

import { setApiAuthTokenGetter } from "@/lib/api-auth"

function useApiAuth() {
  const { getToken } = useAuth()

  useEffect(() => {
    setApiAuthTokenGetter(getToken)
  }, [getToken])
}

export { useApiAuth }
