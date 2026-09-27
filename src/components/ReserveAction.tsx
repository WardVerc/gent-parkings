import "./ReserveAction.css";
import { Button } from "./Button";
import { Tag } from "./Tag";
import type { FacilityView } from "../data/facility";
import { useTranslation } from "../i18n/useTranslation";

interface ReserveActionProps {
  facility: FacilityView;
  heldForName: string | null;
  isFeedStale: boolean;
  onReserve: () => void;
  onCancelReservation: () => void;
}

export function ReserveAction({
  facility,
  heldForName,
  isFeedStale,
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
        showCloseIcon
      >
        {t("reserveAction.reservedFor", { name: heldForName })}
      </Tag>
    );
  }

  const getDisabledReason = (
    facility: FacilityView,
    isFeedStale: boolean,
  ): string | null => {
    if (isFeedStale) return t("reserveAction.reason.feedStale");
    if (facility.status === "closed") return t("reserveAction.reason.closed");
    if (facility.status === "full") return t("reserveAction.reason.full");
    return null;
  };

  const reason = getDisabledReason(facility, isFeedStale);
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
