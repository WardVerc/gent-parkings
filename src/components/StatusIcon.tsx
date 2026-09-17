import "./StatusIcon.css";
import type { FacilityStatus } from "../data/facility";

export type StatusVariant = FacilityStatus | "stale";

interface StatusIconProps {
  variant: StatusVariant;
  size?: number;
}

export function StatusIcon({ variant, size = 16 }: StatusIconProps) {
  return (
    <svg
      className={`status-icon status-icon--${variant}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {variant === "filling-up" ? (
        <>
          <path d="M12 3.5 21 19H3z" />
          <path d="M12 9.5v4" />
          <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          {variant === "open" && <path d="M8 12l3 3 5-6" />}
          {variant === "full" && <path d="M9 9l6 6M15 9l-6 6" />}
          {variant === "closed" && <path d="M6 6l12 12" />}
          {variant === "stale" && <path d="M12 7v5l3 2" />}
        </>
      )}
    </svg>
  );
}
