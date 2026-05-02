import { ImagePlus, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function EmptyGroups({ onCreateGroup }: { onCreateGroup: () => void }) {
  return (
    <Empty className="min-h-[420px] border bg-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImagePlus className="size-5" />
        </EmptyMedia>
        <EmptyTitle>No image groups yet</EmptyTitle>
        <EmptyDescription>
          Create your first shared image board, invite members, and control who can view, upload, rename, or manage images.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" onClick={onCreateGroup}>
          <UsersRound className="size-4" />
          Create group
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export { EmptyGroups }
