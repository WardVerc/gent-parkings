import { isStale } from "./staleness";
import { deriveStatus } from "./status";
import { STALE_THRESHOLD_MS } from "../hooks/useParkingFacilities";

export interface FacilityLocation {
  lat: number;
  lon: number;
}

export interface Facility {
  id: string;
  name: string;
  description: string | null;
  totalCapacity: number;
  availableCapacity: number;
  occupancyPercent: number | null;
  isOpenNow: boolean;
  lastUpdate: string;
  facilityType: string | null;
  openingTimesDescription: string | null;
  operatorInformation: string | null;
  isFreeParking: boolean;
  infoUrl: string | null;
  occupancyTrend: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  location: FacilityLocation | null;
  notes: string | null;
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
