import "./SortControls.css";
import type { SortDirection, SortOption } from "../hooks/useSort";
import { useTranslation } from "../i18n/useTranslation";

interface SortControlsProps<T> {
  options: SortOption<T>[];
  activeSortId: string;
  direction: SortDirection;
  onChange: (sortId: string) => void;
}

export function SortControls<T>({
  options,
  activeSortId,
  direction,
  onChange,
}: SortControlsProps<T>) {
  const t = useTranslation();

  return (
    <div className="sort-controls">
      {options.map((option) => {
        const active = option.id === activeSortId;
        return (
          <button
            key={option.id}
            type="button"
            className={
              active
                ? "sort-controls__button sort-controls__button--active"
                : "sort-controls__button"
            }
            aria-pressed={active}
            onClick={() => onChange(option.id)}
          >
            {t(option.labelKey)}
            {active && (
              <span className="sort-controls__arrow" aria-hidden="true">
                {direction === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
