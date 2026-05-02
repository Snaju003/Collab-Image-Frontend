import { ImagePlus, Sparkles, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"

function DashboardHero({ groupCount, memberCount, inviteCount, onCreateGroup }: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-md sm:p-8">
      <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[radial-gradient(circle_at_top_right,var(--muted),transparent_55%)] lg:block" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="size-4" />
            {inviteCount > 0 ? `${inviteCount} pending invite${inviteCount === 1 ? "" : "s"}` : "Collaborative image workspaces"}
          </div>
          <div className="space-y-3">
            <h2 className="max-w-3xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Share image collections with the right people and the right permissions.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Create private groups for albums, invite collaborators, and keep every upload, rename, and delete action scoped by role.
            </p>
          </div>
          <Button type="button" size="lg" onClick={onCreateGroup}>
            <UsersRound className="size-4" />
            Create image group
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Groups" value={groupCount} />
          <StatCard label="Members" value={memberCount} />
          <div className="col-span-2 rounded-4xl bg-primary p-5 text-primary-foreground">
            <ImagePlus className="mb-8 size-7" />
            <p className="font-heading text-xl font-semibold">Your next shared image board starts here.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-4xl bg-muted p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold">{value}</p>
    </div>
  )
}

type DashboardHeroProps = {
  groupCount: number
  memberCount: number
  inviteCount: number
  onCreateGroup: () => void
}

export { DashboardHero }
