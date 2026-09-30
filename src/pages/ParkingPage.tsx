import { useState } from "react";
import "./ParkingPage.css";
import { useParkingFacilities } from "../hooks/useParkingFacilities";
import { useReservations } from "../hooks/useReservations";
import { FacilityList } from "../features/FacilityList";
import { SortControls } from "../features/SortControls";
import { ReservationModal } from "../features/ReservationModal";
import { FacilityDetailModal } from "../features/FacilityDetailModal";
import { toFacilityView, type FacilityView } from "../data/facility";
import { useSort, type SortOption } from "../hooks/useSort";
import { useTranslation } from "../i18n/useTranslation";
import { Modal } from "../components/Modal";

const FACILITY_SORT_OPTIONS: SortOption<FacilityView>[] = [
  {
    id: "name",
    labelKey: "sort.name",
    defaultDirection: "asc",
    compare: (a, b) => a.name.localeCompare(b.name),
  },
  {
    id: "freeSpaces",
    labelKey: "sort.freeSpaces",
    defaultDirection: "desc",
    compare: (a, b) => a.effectiveFreeSpaces - b.effectiveFreeSpaces,
  },
];

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
  const { sortId, direction, setSort, sort } = useSort(FACILITY_SORT_OPTIONS);

  const facilities =
    data?.map((facility) =>
      toFacilityView(facility, countAtFacility(facility.id)),
    ) ?? null;
  const sortedFacilities = facilities ? sort(facilities) : null;

  const reservingFacility =
    sortedFacilities?.find((facility) => facility.id === reservingFacilityId) ??
    null;
  const cancelingFacility =
    sortedFacilities?.find((facility) => facility.id === cancelingFacilityId) ??
    null;
  const viewingFacility =
    sortedFacilities?.find((facility) => facility.id === viewingFacilityId) ??
    null;

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

        {sortedFacilities && sortedFacilities.length > 0 && (
          <SortControls
            options={FACILITY_SORT_OPTIONS}
            activeSortId={sortId}
            direction={direction}
            onChange={setSort}
          />
        )}

        <FacilityList
          facilities={sortedFacilities}
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
