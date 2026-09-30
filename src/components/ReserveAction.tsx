import "./ReserveAction.css";
import { Button } from "./Button";
import { Tag } from "./Tag";
import type { FacilityView } from "../data/facility";
import { useTranslation } from "../i18n/useTranslation";

interface ReserveActionProps {
  facility: FacilityView;
  heldForName: string | null;
  onReserve: () => void;
  onCancelReservation: () => void;
}

export function ReserveAction({
  facility,
  heldForName,
  onReserve,
  onCancelReservation,
}: ReserveActionProps) {
  const t = useTranslation();

  if (heldForName) {
    return (
      <Tag
        onClick={(event) => {
          event.stopPropagation();
          onCancelReservation();
        }}
      >
        {t("reserveAction.reservedFor", { name: heldForName })}
      </Tag>
    );
  }

  const getDisabledReason = (facility: FacilityView): string | null => {
    if (facility.status === "closed") return t("reserveAction.reason.closed");
    if (facility.status === "full") return t("reserveAction.reason.full");
    return null;
  };

  const reason = getDisabledReason(facility);
  if (reason) {
    return (
      <div className="reserve-action">
        <Button variant="primary" disabled>
          {t("reserveAction.button")}
        </Button>
        <span className="reserve-action__reason">{reason}</span>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={(event) => {
        event.stopPropagation();
        onReserve();
      }}
    >
      {t("reserveAction.button")}
    </Button>
  );
}
