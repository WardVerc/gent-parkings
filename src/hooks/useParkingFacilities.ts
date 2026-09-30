import { useEffect, useState } from "react";
import axios from "axios";
import type { Facility, FacilityLocation } from "../data/facility";
import { readCachedFacilities, writeCachedFacilities } from "../data/storage";

const FEED_URL =
  "https://data.stad.gent/api/explore/v2.1/catalog/datasets/bezetting-parkeergarages-real-time/records";

// The feed refreshes roughly every 60s. Polling at 25s.
const POLL_INTERVAL_MS = 25_000;

export const STALE_THRESHOLD_MS = 3 * 60_000;

interface UseParkingFacilitiesResult {
  data: Facility[] | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
  asOf: string | null;
}

interface FeedRecord {
  id: string;
  name: string;
  description: string | null;
  totalcapacity: number;
  availablecapacity: number;
  openingtimesdescription: string | null;
  isopennow: number;
  temporaryclosed: number;
  operatorinformation: string | null;
  freeparking: number;
  urllinkaddress: string | null;
  locationanddimension: string | null;
  location: FacilityLocation | null;
  text: string | null;
  categorie: string | null;
  lastupdate: string;
}

interface ParsedLocationDetails {
  roadName?: string;
  contactDetailsTelephoneNumber?: string;
}

function parseLocationDetails(
  raw: string | null,
): ParsedLocationDetails | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ParsedLocationDetails;
  } catch {
    return null;
  }
}

function toFacility(record: FeedRecord): Facility {
  const details = parseLocationDetails(record.locationanddimension);
  return {
    id: record.id,
    name: record.name,
    description: record.description ?? null,
    totalCapacity: record.totalcapacity,
    availableCapacity: record.availablecapacity,
    isOpenNow: record.isopennow === 1 && record.temporaryclosed !== 1,
    lastUpdate: record.lastupdate,
    openingTimesDescription: record.openingtimesdescription ?? null,
    operatorInformation: record.operatorinformation ?? null,
    isFreeParking: record.freeparking === 1,
    infoUrl: record.urllinkaddress ?? null,
    category: record.categorie ?? null,
    address: details?.roadName ?? null,
    phone: details?.contactDetailsTelephoneNumber ?? null,
    location: record.location ?? null,
    notes: record.text ?? null,
  };
}

export function useParkingFacilities(): UseParkingFacilitiesResult {
  const [data, setData] = useState<Facility[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [asOf, setAsOf] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const response = await axios.get(FEED_URL, {
          params: { limit: 100 },
        });

        const results = response.data?.results;
        if (!Array.isArray(results)) {
          throw new Error("Unexpected response shape from parking feed");
        }

        const facilities: Facility[] = results.map(toFacility);

        setData(facilities);
        setError(null);
        setIsStale(false);
        setAsOf(new Date().toISOString());
        writeCachedFacilities(facilities);
        setLoading(false);
      } catch (err) {
        const cached = readCachedFacilities();
        if (cached) {
          setData(cached.facilities);
          setIsStale(true);
          setAsOf(cached.fetchedAt);
        }
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load live availability",
        );
        setLoading(false);
      }
    }

    fetchFacilities();
    const interval = setInterval(fetchFacilities, POLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error, isStale, asOf };
}
