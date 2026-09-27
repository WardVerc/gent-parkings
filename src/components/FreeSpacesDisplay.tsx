import "./FreeSpacesDisplay.css";
import { useTranslation } from "../i18n/useTranslation";

interface FreeSpacesDisplayProps {
  freeSpaces: number;
  totalCapacity: number;
}

export function FreeSpacesDisplay({
  freeSpaces,
  totalCapacity,
}: FreeSpacesDisplayProps) {
  const t = useTranslation();

  return (
    <div className="free-spaces">
      <span className="free-spaces__count">{freeSpaces}</span>
      <span className="free-spaces__of">
        {" "}
        {t("card.freeOf", { total: totalCapacity })}
      </span>
    </div>
  );
}
