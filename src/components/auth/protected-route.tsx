import { useAuth } from "@clerk/react"
import { Navigate } from "react-router"

import { Spinner } from "@/components/ui/spinner"
import { useApiAuth } from "@/hooks/use-api-auth"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()
  useApiAuth()

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Spinner className="size-6" />
      </main>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export { ProtectedRoute }
