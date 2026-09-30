import { useEffect, useState } from "react";
import type { Reservation } from "../data/reservation";
import {
  createReservation,
  deleteReservation,
  fetchReservations,
} from "../data/reservationsApi";
import type { TranslationKey } from "../i18n/translations";

type PendingAction = "create" | "delete" | null;

interface TrackedReservation extends Reservation {
  pendingAction: PendingAction;
}

export interface FacilityReservationState {
  reservationId: string;
  heldForName: string | null;
  isPending: boolean;
}

interface UseReservationsResult {
  reservationByFacility: Record<string, FacilityReservationState>;
  countAtFacility: (facilityId: string) => number;
  addReservation: (facilityId: string, driverName: string) => void;
  cancelReservation: (reservationId: string) => void;
  errorKey: TranslationKey | null;
  dismissError: () => void;
}

export function useReservations(): UseReservationsResult {
  const [reservations, setReservations] = useState<TrackedReservation[]>([]);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);

  useEffect(() => {
    async function loadReservations() {
      try {
        const saved = await fetchReservations();
        // Keep creates the user started before the initial load finished.
        setReservations((current) => [
          ...saved.map((reservation) => ({
            ...reservation,
            pendingAction: null,
          })),
          ...current.filter(
            (reservation) => reservation.pendingAction === "create",
          ),
        ]);
      } catch {
        setErrorKey("reservations.error.load");
      }
    }

    loadReservations();
  }, []);

  function countAtFacility(facilityId: string): number {
    return reservations.filter(
      (reservation) =>
        reservation.facilityId === facilityId &&
        reservation.pendingAction !== "delete",
    ).length;
  }

  async function addReservation(
    facilityId: string,
    driverName: string,
  ): Promise<void> {
    const temporaryId = `pending-${crypto.randomUUID()}`;
    setReservations((current) => [
      ...current,
      { id: temporaryId, facilityId, driverName, pendingAction: "create" },
    ]);

    try {
      const saved = await createReservation(facilityId, driverName);
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === temporaryId
            ? { ...saved, pendingAction: null }
            : reservation,
        ),
      );
    } catch {
      setReservations((current) =>
        current.filter((reservation) => reservation.id !== temporaryId),
      );
      setErrorKey("reservations.error.reserve");
    }
  }

  async function cancelReservation(reservationId: string): Promise<void> {
    const target = reservations.find(
      (reservation) => reservation.id === reservationId,
    );
    // A reservation that is still being created has no server id yet.
    if (!target || target.pendingAction !== null) return;

    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, pendingAction: "delete" }
          : reservation,
      ),
    );

    try {
      await deleteReservation(reservationId);
      setReservations((current) =>
        current.filter((reservation) => reservation.id !== reservationId),
      );
    } catch {
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, pendingAction: null }
            : reservation,
        ),
      );
      setErrorKey("reservations.error.cancel");
    }
  }

  const reservationByFacility: Record<string, FacilityReservationState> = {};
  for (const reservation of reservations) {
    reservationByFacility[reservation.facilityId] = {
      reservationId: reservation.id,
      heldForName:
        reservation.pendingAction === "delete" ? null : reservation.driverName,
      isPending: reservation.pendingAction !== null,
    };
  }

  return {
    reservationByFacility,
    countAtFacility,
    addReservation,
    cancelReservation,
    errorKey,
    dismissError: () => setErrorKey(null),
  };
}
