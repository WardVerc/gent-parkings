import axios from "axios";
import type { Reservation } from "./reservation";

const RESERVATIONS_URL = "/api/reservations";

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await axios.get<Reservation[]>(RESERVATIONS_URL);
  return response.data;
}

export async function createReservation(
  facilityId: string,
  driverName: string,
): Promise<Reservation> {
  const response = await axios.post<Reservation>(RESERVATIONS_URL, {
    facilityId,
    driverName,
  });
  return response.data;
}

export async function deleteReservation(id: string): Promise<void> {
  await axios.delete(`${RESERVATIONS_URL}/${id}`);
}
