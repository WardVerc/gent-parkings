import { useTranslation } from "../i18n/useTranslation";
import { Button } from "./Button";
import "./Modal.css";
import type { ReactNode } from "react";
import type { StatusVariant } from "./StatusIcon";
import { StatusChip } from "./StatusChip";

interface ModalProps {
  onClose: () => void;
  children?: ReactNode;
  title: string;
  description?: string;
  onConfirm?: () => void;
  disableConfirm?: boolean;
  confirmLabel?: string;
  danger?: boolean;
  statusChip?: StatusVariant;
}

export function Modal({
  onClose,
  children,
  title,
  description,
  onConfirm,
  disableConfirm = false,
  confirmLabel,
  danger = false,
  statusChip,
}: ModalProps) {
  const t = useTranslation();

  return (
    <div className="modal__scrim" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        {statusChip ? (
          <div className="modal__header">
            <StatusChip variant={statusChip} />
            <h2>{title}</h2>
          </div>
        ) : (
          <h2>{title}</h2>
        )}

        {description && <p className="modal__description">{description}</p>}
        {children}

        <div className="modal__actions">
          <Button variant="secondary" onClick={onClose}>
            {t("modal.close")}
          </Button>

          {onConfirm && (
            <Button
              variant={danger ? "danger" : "primary"}
              disabled={disableConfirm}
              onClick={onConfirm}
            >
              {confirmLabel ? confirmLabel : t("modal.confirm")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
