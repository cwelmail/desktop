export function htmlToPlainText(html: string): string {
  if (typeof document !== "undefined") {
    const element = document.createElement("div")
    element.innerHTML = html
    return (element.textContent || element.innerText || "").replace(/\s+/g, " ").trim()
  }

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
