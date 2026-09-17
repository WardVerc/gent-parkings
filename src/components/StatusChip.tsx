import "./StatusChip.css";
import { StatusIcon, type StatusVariant } from "./StatusIcon";

interface StatusChipProps {
  variant: StatusVariant;
}

export function StatusChip({ variant }: StatusChipProps) {
  return (
    <div className={`status-chip status-chip--${variant}`}>
      <StatusIcon variant={variant} size={20} />
    </div>
  );
}
