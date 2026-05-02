import { UploadCloud } from "lucide-react"
import { useState } from "react"

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

import type { Group } from "@/components/groups/types"

type UploadImageDialogProps = {
  group: Group | null
  isUploading: boolean
  onOpenChange: (open: boolean) => void
  onUploadImage: (group: Group, file: File) => Promise<void>
}

function UploadImageDialog({ group, isUploading, onOpenChange, onUploadImage }: UploadImageDialogProps) {
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!group || !file) {
      return
    }

    await onUploadImage(group, file)
    setFile(null)
    onOpenChange(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setFile(null)
    }

    onOpenChange(open)
  }

  return (
    <Dialog open={Boolean(group)} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Upload image</DialogTitle>
            <DialogDescription>
              Add a new image to {group?.name ?? "this group"}. The file is uploaded to the backend ImageKit pipeline.
            </DialogDescription>
          </DialogHeader>

          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed bg-muted/40 p-6 text-center transition hover:bg-muted">
            <UploadCloud className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{file ? file.name : "Choose an image"}</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, or WebP works best.</p>
            </div>
            <Input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={isUploading}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !file}>
              {isUploading && <Spinner />}
              Upload image
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { UploadImageDialog }
