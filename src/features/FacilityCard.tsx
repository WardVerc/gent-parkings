import "./FacilityCard.css";
import { StatusChip } from "../components/StatusChip";
import { FreeSpacesDisplay } from "../components/FreeSpacesDisplay";
import { ProgressBar } from "../components/ProgressBar";
import { ReserveAction } from "../components/ReserveAction";
import type { StatusVariant } from "../components/StatusIcon";
import { getRelativeAgeSeconds } from "../data/staleness";
import type { FacilityView } from "../data/facility";
import { useTranslation } from "../i18n/useTranslation";

interface FacilityCardProps {
  facility: FacilityView;
  heldForName: string | null;
  isPending: boolean;
  onReserve: (facility: FacilityView) => void;
  onCancelReservation: (facility: FacilityView) => void;
  onViewDetails: (facility: FacilityView) => void;
}

export function FacilityCard({
  facility,
  heldForName,
  isPending,
  onReserve,
  onCancelReservation,
  onViewDetails,
}: FacilityCardProps) {
  const t = useTranslation();
  const variant: StatusVariant = facility.isDataStale
    ? "stale"
    : facility.status;

  const ageSeconds = getRelativeAgeSeconds(facility.lastUpdate);
  const ageText =
    ageSeconds < 60
      ? t("time.secondsAgo", { count: ageSeconds })
      : t("time.minutesAgo", { count: Math.round(ageSeconds / 60) });

  return (
    <div className="facility-card" onClick={() => onViewDetails(facility)}>
      <div className="facility-card__top">
        <StatusChip variant={variant} />
        <div className="facility-card__facility">
          <div className="facility-card__name">{facility.name}</div>
          <div
            className={
              facility.isDataStale
                ? "facility-card__meta facility-card__meta--warn"
                : "facility-card__meta"
            }
          >
            {t("card.updated", { age: ageText })}
          </div>
        </div>
        <FreeSpacesDisplay
          freeSpaces={facility.effectiveFreeSpaces}
          totalCapacity={facility.totalCapacity}
        />
      </div>

      <ProgressBar
        ratio={
          facility.totalCapacity > 0
            ? facility.effectiveFreeSpaces / facility.totalCapacity
            : 0
        }
        variant={variant}
      />

      <div className="facility-card__bottom">
        <ReserveAction
          facility={facility}
          heldForName={heldForName}
          isPending={isPending}
          onReserve={() => onReserve(facility)}
          onCancelReservation={() => onCancelReservation(facility)}
        />
      </div>
    </div>
  );
}
