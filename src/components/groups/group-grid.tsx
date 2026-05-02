import { ImageIcon, MailPlus, ShieldCheck, Trash2, UploadCloud, UserMinus, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

import type { Group, GroupRole } from "@/components/groups/types"

const roleLabels: Record<GroupRole, string> = {
  viewer: "View only",
  contributor: "View, upload, rename",
  admin: "Admin",
}

type GroupGridProps = {
  groups: Group[]
  deletingGroupId: string | null
  modifyingGroupId: string | null
  uploadingGroupId: string | null
  onDeleteGroup: (group: Group) => void
  onModifyGroup: (group: Group, action: "add" | "remove") => void
  onUploadImage: (group: Group) => void
}

function GroupGrid({
  groups,
  deletingGroupId,
  modifyingGroupId,
  uploadingGroupId,
  onDeleteGroup,
  onModifyGroup,
  onUploadImage,
}: GroupGridProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id} className="bg-background p-0">
          <ImageMosaic groupName={group.name} />
          <CardHeader className="px-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              {group.name}
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-3" />
                {roleLabels[group.role]}
              </span>
            </CardTitle>
            <CardDescription>Private image board created {new Date(group.createdAt).toLocaleDateString()}</CardDescription>
            {group.role === "admin" && (
              <CardAction>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onUploadImage(group)}
                    disabled={uploadingGroupId === group.id}
                    aria-label={`Upload image to ${group.name}`}
                  >
                    {uploadingGroupId === group.id ? <Spinner /> : <UploadCloud className="size-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onModifyGroup(group, "add")}
                    disabled={modifyingGroupId === group.id}
                    aria-label={`Add member to ${group.name}`}
                  >
                    <MailPlus className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onModifyGroup(group, "remove")}
                    disabled={modifyingGroupId === group.id}
                    aria-label={`Remove member from ${group.name}`}
                  >
                    {modifyingGroupId === group.id ? <Spinner /> : <UserMinus className="size-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => onDeleteGroup(group)}
                    disabled={deletingGroupId === group.id}
                    aria-label={`Delete ${group.name}`}
                  >
                    {deletingGroupId === group.id ? <Spinner /> : <Trash2 className="size-4" />}
                  </Button>
                </div>
              </CardAction>
            )}
            {group.role !== "admin" && (
              <CardAction>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onUploadImage(group)}
                  disabled={uploadingGroupId === group.id}
                >
                  {uploadingGroupId === group.id ? <Spinner /> : <UploadCloud className="size-4" />}
                  Upload
                </Button>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-muted p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersRound className="size-4" />
                  Members
                </div>
                <p className="mt-2 font-heading text-2xl font-semibold">{group.members}</p>
              </div>
              <div className="rounded-3xl bg-muted p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-4" />
                  Images
                </div>
                <p className="mt-2 font-heading text-2xl font-semibold">{group.imageCount}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">People with access</p>
              <div className="flex flex-wrap gap-2">
                {group.memberEmails.slice(0, 3).map((email) => (
                  <span key={email} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {email}
                  </span>
                ))}
                {group.memberEmails.length > 3 && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    +{group.memberEmails.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ImageMosaic({ groupName }: { groupName: string }) {
  return (
    <div className="grid h-44 grid-cols-[1.25fr_0.75fr] gap-2 p-2">
      <div className="flex items-end rounded-[1.75rem] bg-[linear-gradient(135deg,var(--muted),var(--secondary))] p-4">
        <div className="rounded-2xl bg-background/80 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur">
          {groupName}
        </div>
      </div>
      <div className="grid gap-2">
        <div className="rounded-[1.5rem] bg-primary/15" />
        <div className="rounded-[1.5rem] bg-muted" />
      </div>
    </div>
  )
}

export { GroupGrid }
