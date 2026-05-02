import { useAuth } from "@clerk/react"
import { Navigate } from "react-router"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthHero } from "@/components/auth/auth-hero"
import { Spinner } from "@/components/ui/spinner"

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Spinner className="size-6" />
      </main>
    )
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <AuthHero />
        <section className="flex items-center justify-center">
          <AuthCard mode={mode} />
        </section>
      </div>
    </main>
  )
}

export { AuthPage }
