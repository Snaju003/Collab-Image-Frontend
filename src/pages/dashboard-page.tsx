import { useState } from "react"

import { DashboardHero } from "@/components/dashboard/dashboard-hero"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CreateGroupDialog } from "@/components/groups/create-group-dialog"
import { DeleteGroupDialog } from "@/components/groups/delete-group-dialog"
import { EmptyGroups } from "@/components/groups/empty-groups"
import { GroupsError } from "@/components/groups/groups-error"
import { GroupGrid } from "@/components/groups/group-grid"
import { GroupsLoading } from "@/components/groups/groups-loading"
import { ModifyGroupDialog } from "@/components/groups/modify-group-dialog"
import { NotificationsPanel } from "@/components/groups/notifications-panel"
import { UploadImageDialog } from "@/components/groups/upload-image-dialog"
import { useGroups } from "@/hooks/use-groups"

import type { Group, ModifyGroupAction } from "@/components/groups/types"

function DashboardPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)
  const [groupToUpload, setGroupToUpload] = useState<Group | null>(null)
  const [modifyGroupState, setModifyGroupState] = useState<ModifyGroupState | null>(null)
  const {
    groups,
    notifications,
    unreadCount,
    deletingGroupId,
    modifyingGroupId,
    respondingInviteId,
    uploadingGroupId,
    isCreating,
    isLoading,
    error,
    createGroup,
    deleteGroup,
    modifyGroup,
    respondToInvite,
    uploadImage,
    refreshGroups,
  } = useGroups()
  const memberCount = groups.reduce((total, group) => total + group.members, 0)

  return (
    <main className="min-h-screen bg-muted/30 text-foreground">
      <DashboardHeader onCreateGroup={() => setIsCreateDialogOpen(true)} />
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
        <DashboardHero
          groupCount={groups.length}
          memberCount={memberCount}
          inviteCount={unreadCount}
          onCreateGroup={() => setIsCreateDialogOpen(true)}
        />
        {!isLoading && !error && (
          <NotificationsPanel
            notifications={notifications}
            unreadCount={unreadCount}
            respondingInviteId={respondingInviteId}
            onRespondToInvite={respondToInvite}
          />
        )}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Groups</p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Your image boards</h1>
          </div>
        </div>
        {isLoading && <GroupsLoading />}
        {!isLoading && error && <GroupsError message={error} onRetry={refreshGroups} />}
        {!isLoading && !error && groups.length === 0 && (
          <EmptyGroups onCreateGroup={() => setIsCreateDialogOpen(true)} />
        )}
        {!isLoading && !error && groups.length > 0 && (
          <GroupGrid
            groups={groups}
            deletingGroupId={deletingGroupId}
            modifyingGroupId={modifyingGroupId}
            uploadingGroupId={uploadingGroupId}
            onDeleteGroup={setGroupToDelete}
            onModifyGroup={(group, action) => setModifyGroupState({ group, action })}
            onUploadImage={setGroupToUpload}
          />
        )}
      </section>
      <CreateGroupDialog
        open={isCreateDialogOpen}
        isCreating={isCreating}
        onOpenChange={setIsCreateDialogOpen}
        onCreateGroup={createGroup}
      />
      <DeleteGroupDialog
        group={groupToDelete}
        isDeleting={Boolean(deletingGroupId)}
        onOpenChange={(open) => !open && setGroupToDelete(null)}
        onDeleteGroup={deleteGroup}
      />
      <ModifyGroupDialog
        group={modifyGroupState?.group ?? null}
        action={modifyGroupState?.action ?? "add"}
        isModifying={Boolean(modifyingGroupId)}
        onOpenChange={(open) => !open && setModifyGroupState(null)}
        onModifyGroup={modifyGroup}
      />
      <UploadImageDialog
        group={groupToUpload}
        isUploading={Boolean(uploadingGroupId)}
        onOpenChange={(open) => !open && setGroupToUpload(null)}
        onUploadImage={uploadImage}
      />
    </main>
  )
}

type ModifyGroupState = {
  group: Group
  action: ModifyGroupAction
}

export { DashboardPage }
