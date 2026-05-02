import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function GroupsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Empty className="min-h-[420px] border bg-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert className="size-5" />
        </EmptyMedia>
        <EmptyTitle>Could not load groups</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export { GroupsError }
