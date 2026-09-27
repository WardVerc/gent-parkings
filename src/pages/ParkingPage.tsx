import { useState } from "react";
import "./ParkingPage.css";
import { useParkingFacilities } from "../hooks/useParkingFacilities";
import { useReservations } from "../hooks/useReservations";
import { FacilityList } from "../features/FacilityList";
import { ReservationModal } from "../features/ReservationModal";
import { FacilityDetailModal } from "../features/FacilityDetailModal";
import { toFacilityView } from "../data/facility";
import { useTranslation } from "../i18n/useTranslation";
import { Modal } from "../components/Modal";

export function ParkingPage() {
  const t = useTranslation();
  const { data, loading, error, isStale, asOf } = useParkingFacilities();
  const {
    reservedNameByFacility,
    lastDriverName,
    countAtFacility,
    addReservation,
    cancelReservation,
  } = useReservations();
  const [reservingFacilityId, setReservingFacilityId] = useState<string | null>(
    null,
  );
  const [cancelingFacilityId, setCancelingFacilityId] = useState<string | null>(
    null,
  );
  const [viewingFacilityId, setViewingFacilityId] = useState<string | null>(
    null,
  );

  const facilities =
    data?.map((facility) =>
      toFacilityView(facility, countAtFacility(facility.id)),
    ) ?? null;

  const reservingFacility =
    facilities?.find((facility) => facility.id === reservingFacilityId) ?? null;
  const cancelingFacility =
    facilities?.find((facility) => facility.id === cancelingFacilityId) ?? null;
  const viewingFacility =
    facilities?.find((facility) => facility.id === viewingFacilityId) ?? null;

  const handleConfirm = (driverName: string) => {
    if (!reservingFacility) return;
    addReservation(reservingFacility.id, driverName);
    setReservingFacilityId(null);
  };

  const handleCancelReservation = () => {
    if (!cancelingFacility) return;
    cancelReservation(cancelingFacility.id);
    setCancelingFacilityId(null);
  };

  return (
    <div className="parking-page">
      <header className="parking-page__header">
        <img className="parking-page__logo" src="/logoGent.png" />
        <div className="parking-page__brand">Gent Parkings</div>
      </header>

      <main className="parking-page__body">
        <h1>{t("app.heading")}</h1>
        <p className="parking-page__sub">{t("app.subtitle")}</p>

        <FacilityList
          facilities={facilities}
          loading={loading}
          error={error}
          isStale={isStale}
          asOf={asOf}
          reservedNameByFacility={reservedNameByFacility}
          onReserve={(facility) => setReservingFacilityId(facility.id)}
          onCancelReservation={(facility) =>
            setCancelingFacilityId(facility.id)
          }
          onViewDetails={(facility) => setViewingFacilityId(facility.id)}
        />
      </main>

      {reservingFacility && (
        <ReservationModal
          facility={reservingFacility}
          defaultDriverName={lastDriverName}
          onConfirm={handleConfirm}
          onCancel={() => setReservingFacilityId(null)}
        />
      )}

      {cancelingFacility && (
        <Modal
          title={t("cancelModal.title")}
          description={t("cancelModal.description", {
            name: cancelingFacility.name,
          })}
          onClose={() => setCancelingFacilityId(null)}
          onConfirm={handleCancelReservation}
          danger
          confirmLabel={t("cancelModal.confirm")}
        />
      )}

      {viewingFacility && (
        <FacilityDetailModal
          facility={viewingFacility}
          onClose={() => setViewingFacilityId(null)}
        />
      )}
    </div>
  );
}
