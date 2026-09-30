import { useState } from "react";
import "./ReservationModal.css";
import { Modal } from "../components/Modal";
import { TextField } from "../components/TextField";
import type { FacilityView } from "../data/facility";
import { useTranslation } from "../i18n/useTranslation";

interface ReservationModalProps {
  facility: FacilityView;
  onConfirm: (driverName: string) => void;
  onCancel: () => void;
}

export function ReservationModal({
  facility,
  onConfirm,
  onCancel,
}: ReservationModalProps) {
  const t = useTranslation();
  const [driverName, setDriverName] = useState("");
  const trimmedName = driverName.trim();

  return (
    <Modal
      onClose={onCancel}
      title={t("reserveModal.title", { name: facility.name })}
      description={t("reserveModal.description", {
        free: facility.effectiveFreeSpaces,
        total: facility.totalCapacity,
      })}
      onConfirm={() => onConfirm(trimmedName)}
      disableConfirm={trimmedName.length === 0}
    >
      <TextField
        id="driver-name"
        label={t("reserveModal.nameLabel")}
        value={driverName}
        onChange={(event) => setDriverName(event.target.value)}
        placeholder={t("reserveModal.namePlaceholder")}
        autoFocus
      />
      <p className="reservation-modal__hint">{t("reserveModal.hint")}</p>
    </Modal>
  );
}
