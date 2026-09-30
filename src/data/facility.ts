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
  isOpenNow: boolean;
  lastUpdate: string;
  openingTimesDescription: string | null;
  operatorInformation: string | null;
  isFreeParking: boolean;
  infoUrl: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  location: FacilityLocation | null;
  notes: string | null;
}

export type FacilityStatus = "open" | "filling-up" | "full" | "closed";

export interface FacilityView extends Facility {
  effectiveFreeSpaces: number;
  isDataStale: boolean;
  status: FacilityStatus;
}

export function toFacilityView(
  facility: Facility,
  myReservationCount: number,
): FacilityView {
  const effectiveFreeSpaces = Math.max(
    facility.availableCapacity - myReservationCount,
    0,
  );

  return {
    ...facility,
    effectiveFreeSpaces,
    isDataStale: isStale(facility.lastUpdate, STALE_THRESHOLD_MS),
    status: deriveStatus(facility, effectiveFreeSpaces),
  };
}
