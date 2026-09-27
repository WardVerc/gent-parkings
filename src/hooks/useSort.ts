import { useState } from "react";
import type { TranslationKey } from "../i18n/translations";

export type SortDirection = "asc" | "desc";

export interface SortOption<T> {
  id: string;
  labelKey: TranslationKey;
  defaultDirection: SortDirection;
  compare: (a: T, b: T) => number;
}

export interface UseSortResult<T> {
  sortId: string;
  direction: SortDirection;
  setSort: (sortId: string) => void;
  apply: (items: T[]) => T[];
}

export function useSort<T>(options: SortOption<T>[]): UseSortResult<T> {
  const [sortId, setSortId] = useState(options[0].id);
  const [direction, setDirection] = useState(options[0].defaultDirection);

  function setSort(nextSortId: string): void {
    if (nextSortId === sortId) {
      setDirection(direction === "asc" ? "desc" : "asc");
      return;
    }
    const option = options.find((candidate) => candidate.id === nextSortId);
    setSortId(nextSortId);
    setDirection(option?.defaultDirection ?? "asc");
  }

  function apply(items: T[]): T[] {
    const option = options.find((candidate) => candidate.id === sortId);
    if (!option) return items;
    const sorted = [...items].sort(option.compare);
    return direction === "asc" ? sorted : sorted.reverse();
  }

  return { sortId, direction, setSort, apply };
}
