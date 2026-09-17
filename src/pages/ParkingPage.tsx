import { useState } from "react";
import "./ParkingPage.css";
import { useParkingFacilities } from "../hooks/useParkingFacilities";
import { useReservations } from "../hooks/useReservations";
import { FacilityList } from "../features/FacilityList";
import { ReservationDialog } from "../features/ReservationDialog";
import { toFacilityView, type FacilityView } from "../data/facility";

export function ParkingPage() {
  const { data, loading, error, isStale, asOf } = useParkingFacilities();
  const { reservations, lastDriverName, countAtFacility, addReservation } =
    useReservations();
  const [reservingFacility, setReservingFacility] =
    useState<FacilityView | null>(null);

  const facilities =
    data?.map((facility) =>
      toFacilityView(facility, countAtFacility(facility.id)),
    ) ?? null;

  const reservedNameByFacility: Record<string, string | null> = {};

  for (const reservation of reservations) {
    reservedNameByFacility[reservation.facilityId] = reservation.driverName;
  }

  const handleConfirm = (driverName: string) => {
    if (!reservingFacility) return;
    addReservation(reservingFacility.id, driverName);
    setReservingFacility(null);
  };

  return (
    <div className="parking-page">
      <header className="parking-page__header">
        <div className="parking-page__brand">Gent Parkings</div>
      </header>

      <main className="parking-page__body">
        <h1>Parking facilities</h1>
        <p className="parking-page__sub">Reserve a spot before you arrive</p>

        <FacilityList
          facilities={facilities}
          loading={loading}
          error={error}
          isStale={isStale}
          asOf={asOf}
          reservedNameByFacility={reservedNameByFacility}
          onReserve={setReservingFacility}
        />
      </main>

      {reservingFacility && (
        <ReservationDialog
          facility={reservingFacility}
          defaultDriverName={lastDriverName}
          onConfirm={handleConfirm}
          onCancel={() => setReservingFacility(null)}
        />
      )}
    </div>
  );
}
