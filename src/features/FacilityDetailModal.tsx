import "./FacilityDetailModal.css";
import { Modal } from "../components/Modal";
import { FreeSpacesDisplay } from "../components/FreeSpacesDisplay";
import type { StatusVariant } from "../components/StatusIcon";
import { formatTimestamp } from "../data/staleness";
import type { FacilityView } from "../data/facility";
import { useTranslation } from "../i18n/useTranslation";

interface DetailRow {
  label: string;
  value: string;
  href?: string;
}

interface FacilityDetailModalProps {
  facility: FacilityView;
  onClose: () => void;
}

export function FacilityDetailModal({
  facility,
  onClose,
}: FacilityDetailModalProps) {
  const t = useTranslation();
  const variant: StatusVariant = facility.isDataStale
    ? "stale"
    : facility.status;

  const rows: DetailRow[] = [];
  if (facility.address) {
    rows.push({ label: t("detailModal.address"), value: facility.address });
  }
  if (facility.phone) {
    rows.push({ label: t("detailModal.phone"), value: facility.phone });
  }
  if (facility.openingTimesDescription) {
    rows.push({
      label: t("detailModal.openingHours"),
      value: facility.openingTimesDescription,
    });
  }
  if (facility.operatorInformation) {
    rows.push({
      label: t("detailModal.operator"),
      value: facility.operatorInformation,
    });
  }
  if (facility.category) {
    rows.push({ label: t("detailModal.category"), value: facility.category });
  }
  rows.push({
    label: t("detailModal.freeParking"),
    value: facility.isFreeParking
      ? t("detailModal.freeParking.yes")
      : t("detailModal.freeParking.no"),
  });
  if (facility.location) {
    rows.push({
      label: t("detailModal.location"),
      value: t("detailModal.openInMaps"),
      href: `https://www.google.com/maps/search/?api=1&query=${facility.location.lat},${facility.location.lon}`,
    });
  }

  return (
    <Modal
      onClose={onClose}
      statusChip={variant}
      title={facility.name}
      description={facility.description ? facility.description : ""}
    >
      <div className="facility-detail__free-spaces">
        <FreeSpacesDisplay
          freeSpaces={facility.availableCapacity}
          totalCapacity={facility.totalCapacity}
        />
        <div className="facility-detail__meta">
          {t("detailModal.asOf", {
            time: formatTimestamp(facility.lastUpdate),
          })}
        </div>
      </div>

      {facility.notes && (
        <p className="facility-detail__notes">{facility.notes}</p>
      )}

      <dl className="facility-detail__list">
        {rows.map((row) => (
          <div className="facility-detail__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              {row.href ? (
                <a href={row.href} target="_blank">
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      {facility.infoUrl && (
        <a
          className="facility-detail__link"
          href={facility.infoUrl}
          target="_blank"
        >
          {t("detailModal.infoLink")}
        </a>
      )}
    </Modal>
  );
}
