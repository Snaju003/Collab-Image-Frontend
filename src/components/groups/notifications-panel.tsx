import { Bell, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

import type { GroupNotification, InviteAction } from "@/components/groups/types"

type NotificationsPanelProps = {
  notifications: GroupNotification[]
  unreadCount: number
  respondingInviteId: string | null
  onRespondToInvite: (notification: GroupNotification, action: InviteAction) => Promise<void>
}

function NotificationsPanel({
  notifications,
  unreadCount,
  respondingInviteId,
  onRespondToInvite,
}: NotificationsPanelProps) {
  const pendingNotifications = notifications.filter((notification) => notification.status === "pending")

  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Bell className="size-5" />
          </div>
          <div>
            <CardTitle>Invites</CardTitle>
            <CardDescription>
              {unreadCount > 0 ? `${unreadCount} invite${unreadCount === 1 ? "" : "s"} need attention` : "No unread invites"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingNotifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-5 text-sm text-muted-foreground">
            New group invitations will appear here.
          </div>
        ) : (
          pendingNotifications.map((notification) => (
            <div key={notification.id} className="rounded-3xl border bg-card p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{notification.groupName}</p>
                  <p className="text-sm text-muted-foreground">
                    Invited {new Date(notification.invitedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onRespondToInvite(notification, "accept")}
                    disabled={respondingInviteId === notification.id}
                  >
                    {respondingInviteId === notification.id ? <Spinner /> : <Check className="size-4" />}
                    Accept
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onRespondToInvite(notification, "reject")}
                    disabled={respondingInviteId === notification.id}
                  >
                    <X className="size-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export { NotificationsPanel }
