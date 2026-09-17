import { isStale } from "./staleness";
import { deriveStatus } from "./status";

export interface Facility {
  id: string;
  name: string;
  totalCapacity: number;
  availableCapacity: number;
  isOpenNow: boolean;
  lastUpdate: string;
}

export type FacilityStatus = "open" | "filling-up" | "full" | "closed";

export interface FacilityView extends Facility {
  myReservationCount: number;
  effectiveFreeSpaces: number;
  // The feed shows fewer free spaces than our own reservations would predict — someone else likely took a spot.
  hasFewerThanExpected: boolean;
  isDataStale: boolean;
  status: FacilityStatus;
}

// The feed updates in batches and isn't perfectly regular in practice (observed lag up to
// ~4 minutes between batches even when healthy) — 5 minutes avoids flagging normal lag as stale.
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

export function toFacilityView(
  facility: Facility,
  myReservationCount: number,
): FacilityView {
  const rawFreeSpaces = facility.availableCapacity - myReservationCount;
  const effectiveFreeSpaces = Math.max(rawFreeSpaces, 0);

  return {
    ...facility,
    myReservationCount,
    effectiveFreeSpaces,
    hasFewerThanExpected: rawFreeSpaces < 0,
    isDataStale: isStale(facility.lastUpdate, STALE_THRESHOLD_MS),
    status: deriveStatus(facility, effectiveFreeSpaces),
  };
}
