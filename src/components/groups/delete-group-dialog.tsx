import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

import type { Group } from "@/components/groups/types"

type DeleteGroupDialogProps = {
  group: Group | null
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onDeleteGroup: (groupId: string) => Promise<void>
}

function DeleteGroupDialog({
  group,
  isDeleting,
  onOpenChange,
  onDeleteGroup,
}: DeleteGroupDialogProps) {
  async function handleDelete() {
    if (!group) {
      return
    }

    await onDeleteGroup(group.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={Boolean(group)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete group</DialogTitle>
          <DialogDescription>
            This will permanently delete {group ? `"${group.name}"` : "this group"}. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Spinner />}
            Delete group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteGroupDialog }
