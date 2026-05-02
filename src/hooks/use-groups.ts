import { useUser } from "@clerk/react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import {
  authenticateUser,
  createGroup,
  deleteGroup,
  getGroups,
  getNotifications,
  modifyGroup,
  respondToInvite,
  uploadImage,
} from "@/services/groups-api"

import type { Group, GroupNotification, InviteAction, ModifyGroupAction } from "@/components/groups/types"

function useGroups() {
  const { user } = useUser()
  const [groups, setGroups] = useState<Group[]>([])
  const [notifications, setNotifications] = useState<GroupNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [uploadingGroupId, setUploadingGroupId] = useState<string | null>(null)
  const [respondingInviteId, setRespondingInviteId] = useState<string | null>(null)
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null)
  const [modifyingGroupId, setModifyingGroupId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const email = user?.primaryEmailAddress?.emailAddress
  const username = user?.username ?? email?.split("@")[0] ?? "user"

  const loadGroups = useCallback(async () => {
    if (!email) {
      setGroups([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await authenticateUser()
      const [groupsResult, notificationsResult] = await Promise.all([
        getGroups({ email, currentUserEmail: email }),
        getNotifications(),
      ])
      setGroups(groupsResult.groups)
      setNotifications(notificationsResult.notifications)
      setUnreadCount(notificationsResult.unreadCount)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to load groups."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [email])

  async function handleCreateGroup(groupName: string) {
    setIsCreating(true)

    try {
      await createGroup(groupName)
      toast.success("Group created successfully.")
      await loadGroups()
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to create group."
      toast.error(message)
      throw caughtError
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteGroup(groupId: string) {
    setDeletingGroupId(groupId)

    try {
      await deleteGroup(groupId)
      toast.success("Group deleted successfully.")
      await loadGroups()
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to delete group."
      toast.error(message)
      throw caughtError
    } finally {
      setDeletingGroupId(null)
    }
  }

  async function handleModifyGroup(groupId: string, memberEmail: string, action: ModifyGroupAction) {
    setModifyingGroupId(groupId)

    try {
      await modifyGroup(groupId, memberEmail, action)
      toast.success(action === "add" ? "Invite sent successfully." : "Member removed successfully.")
      await loadGroups()
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to update group members."
      toast.error(message)
      throw caughtError
    } finally {
      setModifyingGroupId(null)
    }
  }

  async function handleRespondToInvite(notification: GroupNotification, action: InviteAction) {
    setRespondingInviteId(notification.id)

    try {
      await respondToInvite(notification.groupId, action)
      toast.success(action === "accept" ? "Invite accepted." : "Invite rejected.")
      await loadGroups()
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to respond to invite."
      toast.error(message)
      throw caughtError
    } finally {
      setRespondingInviteId(null)
    }
  }

  async function handleUploadImage(group: Group, file: File) {
    setUploadingGroupId(group.id)

    try {
      await uploadImage({ file, username, usergroup: group.name })
      toast.success("Image uploaded successfully.")
      await loadGroups()
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to upload image."
      toast.error(message)
      throw caughtError
    } finally {
      setUploadingGroupId(null)
    }
  }

  useEffect(() => {
    let isCurrent = true

    if (!email) {
      Promise.resolve().then(() => {
        if (isCurrent) {
          setGroups([])
          setNotifications([])
          setUnreadCount(0)
          setIsLoading(false)
        }
      })

      return () => {
        isCurrent = false
      }
    }

    authenticateUser()
      .then(() => Promise.all([getGroups({ email, currentUserEmail: email }), getNotifications()]))
      .then(([groupsResult, notificationsResult]) => {
        if (isCurrent) {
          setGroups(groupsResult.groups)
          setNotifications(notificationsResult.notifications)
          setUnreadCount(notificationsResult.unreadCount)
          setError(null)
        }
      })
      .catch((caughtError: unknown) => {
        const message = caughtError instanceof Error ? caughtError.message : "Unable to load groups."

        if (isCurrent) {
          setError(message)
          toast.error(message)
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [email])

  return {
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
    createGroup: handleCreateGroup,
    deleteGroup: handleDeleteGroup,
    modifyGroup: handleModifyGroup,
    respondToInvite: handleRespondToInvite,
    uploadImage: handleUploadImage,
    refreshGroups: loadGroups,
  }
}

export { useGroups }
