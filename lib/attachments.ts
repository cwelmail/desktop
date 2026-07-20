export const MAX_COMPOSE_ATTACHMENTS = 10
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024
export const MAX_ATTACHMENTS_TOTAL_BYTES = 25 * 1024 * 1024

export type PendingAttachment = {
  id: string
  file: File
  filename: string
  contentType: string
  size: number
}

export function formatAttachmentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== "string") {
        reject(new Error("Could not read file"))
        return
      }
      const comma = result.indexOf(",")
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"))
    reader.readAsDataURL(file)
  })
}

export function validatePendingAttachments(
  attachments: PendingAttachment[],
): string | null {
  if (attachments.length > MAX_COMPOSE_ATTACHMENTS) {
    return `At most ${MAX_COMPOSE_ATTACHMENTS} attachments allowed.`
  }

  let total = 0
  for (const attachment of attachments) {
    if (attachment.size > MAX_ATTACHMENT_BYTES) {
      return `${attachment.filename} exceeds the 10 MB per-file limit.`
    }
    total += attachment.size
    if (total > MAX_ATTACHMENTS_TOTAL_BYTES) {
      return "Total attachment size exceeds the 25 MB limit."
    }
  }

  return null
}
