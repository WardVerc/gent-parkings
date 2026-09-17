import { useState } from "react";
import type { Reservation } from "../data/reservation";
import { readReservations, writeReservations } from "../data/storage";

export interface UseReservationsResult {
  reservations: Reservation[];
  lastDriverName: string | null;
  countAtFacility: (facilityId: string) => number;
  addReservation: (facilityId: string, driverName: string) => void;
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
    const reservation: Reservation = {
      id: crypto.randomUUID(),
      facilityId,
      driverName,
      createdAt: new Date().toISOString(),
    };
    const next = [...reservations, reservation];
    setReservations(next);
    writeReservations(next);
  }

  const lastDriverName =
    reservations.length > 0
      ? reservations[reservations.length - 1].driverName
      : null;

  return { reservations, lastDriverName, countAtFacility, addReservation };
}
