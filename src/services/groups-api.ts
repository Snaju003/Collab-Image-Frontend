import { apiClient } from "@/lib/api-client"

import type { Group, GroupNotification, InviteAction, ModifyGroupAction } from "@/components/groups/types"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "https://collab-image-backend.vercel.app"

type BackendGroup = {
  _id: string
  name: string
  access: string[]
  createdAt: string
  createdBy: {
    userId: string
    email: string
  }
}

type GetGroupsResponse = {
  success: boolean
  type: "created" | "shared" | "all"
  data: BackendGroup[]
  meta: {
    total: number
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

type GetGroupsParams = {
  email: string
  currentUserEmail?: string
  page?: number
  limit?: number
  type?: "created" | "shared" | "all"
}

type UserSearchResponse = {
  success: boolean
  emails: string[]
}

type NotificationsResponse = {
  success: boolean
  data: BackendNotification[]
  unreadCount: number
}

type BackendNotification = {
  _id?: string
  groupId: string
  groupName?: string
  invitedAt?: string
  isSeen?: boolean
  status: "pending" | "accepted" | "rejected"
}

async function authenticateUser() {
  return apiClient.request<unknown>({
    url: `${API_BASE_URL}/auth/login`,
    method: "GET",
  })
}

async function searchUsers(email: string) {
  const params = new URLSearchParams({ email })

  const response = await apiClient.request<UserSearchResponse>({
    url: `${API_BASE_URL}/auth/usersearch?${params.toString()}`,
    method: "GET",
  })

  return response.emails
}

async function getGroups({ email, currentUserEmail = email, page = 1, limit = 10, type = "all" }: GetGroupsParams) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    type,
  })

  const response = await apiClient.request<GetGroupsResponse>({
    url: `${API_BASE_URL}/group/getgroups/${encodeURIComponent(email)}?${params.toString()}`,
    method: "GET",
  })

  return {
    groups: response.data.map((group) => mapBackendGroupToGroup(group, currentUserEmail)),
    meta: response.meta,
  }
}

async function createGroup(groupName: string) {
  return apiClient.request<unknown>({
    url: `${API_BASE_URL}/group/creategroup/${encodeURIComponent(groupName)}`,
    method: "POST",
  })
}

async function deleteGroup(groupId: string) {
  return apiClient.request<unknown>({
    url: `${API_BASE_URL}/group/deletegroup/${encodeURIComponent(groupId)}`,
    method: "DELETE",
  })
}

async function modifyGroup(groupId: string, email: string, action: ModifyGroupAction) {
  return apiClient.request<unknown>({
    url: `${API_BASE_URL}/group/manageGroupAccess/${encodeURIComponent(groupId)}/${encodeURIComponent(email)}/${action}`,
    method: "PUT",
  })
}

async function getNotifications() {
  const response = await apiClient.request<NotificationsResponse>({
    url: `${API_BASE_URL}/group/userNotifications`,
    method: "GET",
  })

  return {
    notifications: response.data.map(mapBackendNotificationToNotification),
    unreadCount: response.unreadCount,
  }
}

async function respondToInvite(groupId: string, action: InviteAction) {
  return apiClient.request<unknown>({
    url: `${API_BASE_URL}/group/respondToInvite/${encodeURIComponent(groupId)}/${action}`,
    method: "GET",
  })
}

async function uploadImage(params: { file: File; username: string; usergroup: string }) {
  const formData = new FormData()
  formData.append("image", params.file)
  formData.append("username", params.username)
  formData.append("usergroup", params.usergroup)

  return apiClient.request<unknown>({
    url: `${API_BASE_URL}/upload/uploadImage`,
    method: "POST",
    body: formData,
  })
}

function mapBackendGroupToGroup(group: BackendGroup, currentUserEmail: string): Group {
  return {
    id: group._id,
    name: group.name,
    role: group.createdBy.email === currentUserEmail ? "admin" : "contributor",
    members: group.access.length,
    memberEmails: group.access,
    imageCount: 0,
    createdAt: group.createdAt,
  }
}

function mapBackendNotificationToNotification(notification: BackendNotification): GroupNotification {
  return {
    id: notification._id ?? `${notification.groupId}-${notification.status}`,
    groupId: notification.groupId,
    groupName: notification.groupName ?? "Untitled group",
    invitedAt: notification.invitedAt ?? new Date().toISOString(),
    isSeen: Boolean(notification.isSeen),
    status: notification.status,
  }
}

export { authenticateUser, createGroup, deleteGroup, getGroups, getNotifications, modifyGroup, respondToInvite, searchUsers, uploadImage }
export type { GetGroupsResponse }
