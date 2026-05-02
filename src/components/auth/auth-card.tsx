import { SignIn, SignUp } from "@clerk/react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function AuthCard({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login"

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? "Welcome back" : "Create your account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Sign in to open your groups dashboard."
            : "Register to start creating collaborative image groups."}
        </CardDescription>
        <CardAction>
          <Button asChild type="button" variant="ghost" size="sm">
            <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Register" : "Login"}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-center">
        {isLogin ? (
          <SignIn signUpUrl="/register" forceRedirectUrl="/dashboard" />
        ) : (
          <SignUp signInUrl="/login" forceRedirectUrl="/dashboard" />
        )}
      </CardContent>
    </Card>
  )
}

export { AuthCard }
