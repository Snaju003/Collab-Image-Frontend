import { Skeleton } from "@/components/ui/skeleton"

function GroupsLoading() {
  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-80 rounded-4xl" />
      ))}
    </div>
  )
}

export { GroupsLoading }
