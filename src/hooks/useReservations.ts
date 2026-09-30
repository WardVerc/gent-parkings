import { useState } from "react";
import type { Reservation } from "../data/reservation";
import { readReservations, writeReservations } from "../data/storage";

interface UseReservationsResult {
  reservedNameByFacility: Record<string, string>;
  countAtFacility: (facilityId: string) => number;
  addReservation: (facilityId: string, driverName: string) => void;
  cancelReservation: (facilityId: string) => void;
}

export function useReservations(): UseReservationsResult {
  const [reservations, setReservations] =
    useState<Reservation[]>(readReservations);

  function countAtFacility(facilityId: string): number {
    return reservations.filter(
      (reservation) => reservation.facilityId === facilityId,
    ).length;
  }

  function addReservation(facilityId: string, driverName: string): void {
    const reservation: Reservation = { facilityId, driverName };
    const next = [...reservations, reservation];
    setReservations(next);
    writeReservations(next);
  }

  function cancelReservation(facilityId: string): void {
    const next = reservations.filter(
      (reservation) => reservation.facilityId !== facilityId,
    );
    setReservations(next);
    writeReservations(next);
  }

  const reservedNameByFacility: Record<string, string> = {};
  for (const reservation of reservations) {
    reservedNameByFacility[reservation.facilityId] = reservation.driverName;
  }

  return {
    reservedNameByFacility,
    countAtFacility,
    addReservation,
    cancelReservation,
  };
}
