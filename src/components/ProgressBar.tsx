import "./ProgressBar.css";
import type { StatusVariant } from "./StatusIcon";

interface ProgressBarProps {
  ratio: number;
  variant: StatusVariant;
}

export function ProgressBar({ ratio, variant }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <div
        className={`progress-bar__fill progress-bar__fill--${variant}`}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
