import type { Reservation } from "./reservation";

const RESERVATIONS_KEY = "parking:reservations";

export function readReservations(): Reservation[] {
  const raw = localStorage.getItem(RESERVATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Reservation[];
  } catch {
    return [];
  }
}

export function writeReservations(reservations: Reservation[]): void {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}
