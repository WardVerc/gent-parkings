import "./FacilityCard.css";
import { StatusChip } from "../components/StatusChip";
import { FreeSpacesDisplay } from "../components/FreeSpacesDisplay";
import { ProgressBar } from "../components/ProgressBar";
import { ReserveAction } from "../components/ReserveAction";
import type { StatusVariant } from "../components/StatusIcon";
import { formatRelativeAge } from "../data/staleness";
import type { FacilityView } from "../data/facility";

interface FacilityCardProps {
  facility: FacilityView;
  heldForName: string | null;
  isFeedStale: boolean;
  onReserve: (facility: FacilityView) => void;
}

export function FacilityCard({
  facility,
  heldForName,
  isFeedStale,
  onReserve,
}: FacilityCardProps) {
  const variant: StatusVariant = facility.isDataStale
    ? "stale"
    : facility.status;

  return (
    <div className="facility-card">
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
            Updated {formatRelativeAge(facility.lastUpdate)}
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
          isFeedStale={isFeedStale}
          onReserve={() => onReserve(facility)}
        />
      </div>
    </div>
  );
}
