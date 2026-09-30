import "./FacilityList.css";
import { FacilityCard } from "./FacilityCard";
import type { FacilityView } from "../data/facility";
import type { FacilityReservationState } from "../hooks/useReservations";
import { useTranslation } from "../i18n/useTranslation";

interface FacilityListProps {
  facilities: FacilityView[] | null;
  loading: boolean;
  error: string | null;
  reservationByFacility: Record<string, FacilityReservationState>;
  onReserve: (facility: FacilityView) => void;
  onCancelReservation: (facility: FacilityView) => void;
  onViewDetails: (facility: FacilityView) => void;
}

export function FacilityList({
  facilities,
  loading,
  error,
  reservationByFacility,
  onReserve,
  onCancelReservation,
  onViewDetails,
}: FacilityListProps) {
  const t = useTranslation();

  if (loading && !facilities) {
    return (
      <div>
        <div className="facility-list__skeleton-row" />
        <div className="facility-list__skeleton-row" />
        <div className="facility-list__skeleton-row" />
      </div>
    );
  }

  if (error && !facilities) {
    return (
      <div className="facility-list__message">
        <p>{t("list.errorTitle")}</p>
        <p className="facility-list__message-sub">{t("list.errorSubtitle")}</p>
      </div>
    );
  }

  if (facilities && facilities.length === 0) {
    return (
      <div className="facility-list__message">
        <p>{t("list.empty")}</p>
      </div>
    );
  }

  return (
    <div>
      {facilities &&
        facilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            heldForName={
              reservationByFacility[facility.id]?.heldForName ?? null
            }
            isPending={reservationByFacility[facility.id]?.isPending ?? false}
            onReserve={onReserve}
            onCancelReservation={onCancelReservation}
            onViewDetails={onViewDetails}
          />
        ))}
    </div>
  );
}
