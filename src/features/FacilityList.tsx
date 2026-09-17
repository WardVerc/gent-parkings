import "./FacilityList.css";
import { FacilityCard } from "./FacilityCard";
import type { FacilityView } from "../data/facility";

interface FacilityListProps {
  facilities: FacilityView[] | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
  asOf: string | null;
  reservedNameByFacility: Record<string, string | null>;
  onReserve: (facility: FacilityView) => void;
}

export function FacilityList({
  facilities,
  loading,
  error,
  isStale,
  asOf,
  reservedNameByFacility,
  onReserve,
}: FacilityListProps) {
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
        <p>Can't reach live parking data right now.</p>
        <p className="facility-list__message-sub">
          We'll keep trying automatically every 25 seconds.
        </p>
      </div>
    );
  }

  if (facilities && facilities.length === 0) {
    return (
      <div className="facility-list__message">
        <p>No facilities to show right now.</p>
      </div>
    );
  }

  const formatTime = (iso: string): string => {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {isStale && asOf && (
        <div className="facility-list__banner">
          Live feed unavailable — showing data as of {formatTime(asOf)}.
        </div>
      )}
      {facilities?.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
          heldForName={reservedNameByFacility[facility.id] ?? null}
          isFeedStale={isStale}
          onReserve={onReserve}
        />
      ))}
    </div>
  );
}
