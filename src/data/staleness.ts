export function isStale(lastUpdate: string, thresholdMs: number): boolean {
  return Date.now() - new Date(lastUpdate).getTime() > thresholdMs;
}

export function getRelativeAgeSeconds(lastUpdate: string): number {
  return Math.max(
    0,
    Math.round((Date.now() - new Date(lastUpdate).getTime()) / 1000),
  );
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
