import { ImagePlus } from "lucide-react"

function AuthHero() {
  return (
    <section className="flex flex-col justify-between gap-12 rounded-4xl border bg-card p-8 shadow-md lg:p-10">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ImagePlus className="size-5" />
        </div>
        <div>
          <p className="font-heading text-lg font-semibold">Collab Image</p>
          <p className="text-sm text-muted-foreground">Private image groups for teams</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="inline-flex rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Role-based image sharing
        </div>
        <div className="space-y-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Create groups, invite people, and control every image action.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Admins manage members and permissions, contributors can upload and rename, and viewers get safe read-only access.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Feature label="Groups" value="Create shared spaces" />
        <Feature label="Roles" value="Viewer, contributor, admin" />
        <Feature label="Images" value="Upload and organize together" />
      </div>
    </section>
  )
}

function Feature({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-muted p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  )
}

export { AuthHero }
