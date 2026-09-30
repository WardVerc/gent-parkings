import "./ReserveAction.css";
import { Button } from "./Button";
import { Tag } from "./Tag";
import type { FacilityView } from "../data/facility";
import { useTranslation } from "../i18n/useTranslation";

interface ReserveActionProps {
  facility: FacilityView;
  heldForName: string | null;
  isPending: boolean;
  onReserve: () => void;
  onCancelReservation: () => void;
}

export function ReserveAction({
  facility,
  heldForName,
  isPending,
  onReserve,
  onCancelReservation,
}: ReserveActionProps) {
  const t = useTranslation();
  const pendingClassName = isPending ? "reserve-action--pending" : "";

  if (heldForName) {
    return (
      <Tag
        className={pendingClassName}
        onClick={(event) => {
          event.stopPropagation();
          if (isPending) return;
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
      <div className={`reserve-action ${pendingClassName}`}>
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
      className={pendingClassName}
      aria-busy={isPending}
      onClick={(event) => {
        event.stopPropagation();
        if (isPending) return;
        onReserve();
      }}
    >
      {t("reserveAction.button")}
    </Button>
  );
}
