import "./Tag.css";
import { StatusIcon } from "./StatusIcon";
import type { MouseEventHandler, ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  showCloseIcon?: boolean;
}

export function Tag({ children, onClick, showCloseIcon }: TagProps) {
  if (onClick) {
    return (
      <button type="button" className="tag tag--reserved" onClick={onClick}>
        <StatusIcon variant="open" size={15} />
        {children}
        {showCloseIcon && (
          <svg
            className="tag__close-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <span className="tag tag--reserved">
      <StatusIcon variant="open" size={15} />
      {children}
    </span>
  );
}
