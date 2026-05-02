import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { searchUsers } from "@/services/groups-api"

import type { Group, ModifyGroupAction } from "@/components/groups/types"

type ModifyGroupDialogProps = {
  group: Group | null
  action: ModifyGroupAction
  isModifying: boolean
  onOpenChange: (open: boolean) => void
  onModifyGroup: (groupId: string, email: string, action: ModifyGroupAction) => Promise<void>
}

function ModifyGroupDialog({
  group,
  action,
  isModifying,
  onOpenChange,
  onModifyGroup,
}: ModifyGroupDialogProps) {
  const [email, setEmail] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const isAdding = action === "add"

  useEffect(() => {
    let isCurrent = true
    const search = email.trim()

    if (!isAdding || search.length < 2) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    const timeoutId = window.setTimeout(() => {
      searchUsers(search)
        .then((emails) => {
          if (isCurrent) {
            setSuggestions(emails)
          }
        })
        .catch(() => {
          if (isCurrent) {
            setSuggestions([])
          }
        })
        .finally(() => {
          if (isCurrent) {
            setIsSearching(false)
          }
        })
    }, 250)

    return () => {
      isCurrent = false
      window.clearTimeout(timeoutId)
    }
  }, [email, isAdding])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!group || !email.trim()) {
      return
    }

    await onModifyGroup(group.id, email.trim(), action)
    setEmail("")
    onOpenChange(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setEmail("")
      setSuggestions([])
    }

    onOpenChange(open)
  }

  return (
    <Dialog open={Boolean(group)} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>{isAdding ? "Add member" : "Remove member"}</DialogTitle>
            <DialogDescription>
              {isAdding
                ? `Invite a teammate into ${group?.name ?? "this group"}.`
                : `Remove access from ${group?.name ?? "this group"}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="member-email" className="text-sm font-medium">
              Member email
            </label>
            <div className="space-y-2">
              <Input
                id="member-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teammate@example.com"
                disabled={isModifying}
              />
              {isAdding && (isSearching || suggestions.length > 0) && (
                <div className="rounded-2xl border bg-background p-2">
                  {isSearching && <p className="px-2 py-1 text-xs text-muted-foreground">Searching users...</p>}
                  {!isSearching &&
                    suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="block w-full rounded-xl px-2 py-1.5 text-left text-sm hover:bg-muted"
                        onClick={() => setEmail(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {!isAdding && group && group.memberEmails.length > 0 && (
            <div className="space-y-2 rounded-3xl bg-muted p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current access</p>
              <div className="flex flex-wrap gap-2">
                {group.memberEmails.map((memberEmail) => (
                  <button
                    key={memberEmail}
                    type="button"
                    className="rounded-full bg-background px-3 py-1 text-xs text-foreground ring-1 ring-border"
                    onClick={() => setEmail(memberEmail)}
                  >
                    {memberEmail}
                  </button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isModifying}>
              Cancel
            </Button>
            <Button type="submit" disabled={isModifying || email.trim().length === 0}>
              {isModifying && <Spinner />}
              {isAdding ? "Add member" : "Remove member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { ModifyGroupDialog }
