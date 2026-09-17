import { useState } from "react";
import "./ReservationDialog.css";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import type { FacilityView } from "../data/facility";

interface ReservationDialogProps {
  facility: FacilityView;
  defaultDriverName: string | null;
  onConfirm: (driverName: string) => void;
  onCancel: () => void;
}

export function ReservationDialog({
  facility,
  defaultDriverName,
  onConfirm,
  onCancel,
}: ReservationDialogProps) {
  const [driverName, setDriverName] = useState(defaultDriverName ?? "");
  const trimmedName = driverName.trim();

  return (
    <div className="reservation-dialog__scrim" onClick={onCancel}>
      <div
        className="reservation-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Reserve a spot at {facility.name}?</h2>
        <p className="reservation-dialog__description">
          {facility.effectiveFreeSpaces} spaces free of {facility.totalCapacity}{" "}
          right now. We'll hold 1 spot for 30 minutes after your planned arrival
          time.
        </p>
        <TextField
          id="driver-name"
          label="Your name"
          value={driverName}
          onChange={(event) => setDriverName(event.target.value)}
          placeholder="e.g. Ward"
          autoFocus
        />
        <p className="reservation-dialog__hint">
          We'll remember this on this device for next time.
        </p>
        <div className="reservation-dialog__actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={trimmedName.length === 0}
            onClick={() => onConfirm(trimmedName)}
          >
            Confirm reservation
          </Button>
        </div>
      </div>
    </div>
  );
}
