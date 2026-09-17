export function isStale(lastUpdate: string, thresholdMs: number): boolean {
  return Date.now() - new Date(lastUpdate).getTime() > thresholdMs
}

export function formatRelativeAge(lastUpdate: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(lastUpdate).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  return `${minutes}m ago`
}
