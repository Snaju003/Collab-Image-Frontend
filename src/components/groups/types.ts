type GroupRole = "viewer" | "contributor" | "admin"

type Group = {
  id: string
  name: string
  role: GroupRole
  members: number
  memberEmails: string[]
  imageCount: number
  createdAt: string
}

type ModifyGroupAction = "add" | "remove"
type InviteAction = "accept" | "reject"

type GroupNotification = {
  id: string
  groupId: string
  groupName: string
  invitedAt: string
  isSeen: boolean
  status: "pending" | "accepted" | "rejected"
}

export type { Group, GroupNotification, GroupRole, InviteAction, ModifyGroupAction }
