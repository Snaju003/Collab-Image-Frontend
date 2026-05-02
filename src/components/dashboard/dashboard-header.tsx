import { UserButton, useUser } from "@clerk/react"
import { ImagePlus, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"

function DashboardHeader({ onCreateGroup }: { onCreateGroup: () => void }) {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ImagePlus className="size-5" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Collab Image</p>
            <p className="text-sm text-muted-foreground">
              {user?.firstName ? `Welcome back, ${user.firstName}` : "Image collaboration dashboard"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" size="sm" onClick={onCreateGroup}>
            <UsersRound className="size-4" />
            New group
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  )
}

export { DashboardHeader }
