import { detectLocale } from "../i18n/translations";
import type { TranslateFn } from "../i18n/useTranslation";

export function isStale(lastUpdate: string, thresholdMs: number): boolean {
  return Date.now() - new Date(lastUpdate).getTime() > thresholdMs;
}

export function getRelativeAgeSeconds(lastUpdate: string): number {
  return Math.max(
    0,
    Math.round((Date.now() - new Date(lastUpdate).getTime()) / 1000),
  );
}

export function formatTimestamp(iso: string, t: TranslateFn): string {
  const locale = detectLocale();
  const date = new Date(iso);
  const now = new Date();

  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return time;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isYesterday) return `${t("time.yesterday")}, ${time}`;

  const dateStr = date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  });
  return `${dateStr}, ${time}`;
}
