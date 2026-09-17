import { useEffect, useState } from "react";
import axios from "axios";
import type { Facility } from "../data/facility";
import { readCachedFacilities, writeCachedFacilities } from "../data/storage";

const FEED_URL =
  "https://data.stad.gent/api/explore/v2.1/catalog/datasets/bezetting-parkeergarages-real-time/records";

// The feed refreshes roughly every 60s. Polling at 25s.
const POLL_INTERVAL_MS = 25_000;

export interface UseParkingFacilitiesResult {
  data: Facility[] | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
  asOf: string | null;
}

interface FeedRecord {
  id: string;
  name: string;
  totalcapacity: number;
  availablecapacity: number;
  isopennow: number;
  temporaryclosed: number;
  lastupdate: string;
}

function toFacility(record: FeedRecord): Facility {
  return {
    id: record.id,
    name: record.name,
    totalCapacity: record.totalcapacity,
    availableCapacity: record.availablecapacity,
    isOpenNow: record.isopennow === 1 && record.temporaryclosed !== 1,
    lastUpdate: record.lastupdate,
  };
}

export function useParkingFacilities(): UseParkingFacilitiesResult {
  const [data, setData] = useState<Facility[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [asOf, setAsOf] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchFacilities() {
      try {
        const response = await axios.get(FEED_URL, { params: { limit: 100 } });
        if (cancelled) return;
        const facilities: Facility[] = response.data.results.map(toFacility);
        setData(facilities);
        setError(null);
        setIsStale(false);
        setAsOf(new Date().toISOString());
        writeCachedFacilities(facilities);
      } catch (err) {
        if (cancelled) return;
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
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFacilities();
    const interval = setInterval(fetchFacilities, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error, isStale, asOf };
}
