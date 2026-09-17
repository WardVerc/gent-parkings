import "./ReserveAction.css";
import { Button } from "./Button";
import { Tag } from "./Tag";
import type { FacilityView } from "../data/facility";

interface ReserveActionProps {
  facility: FacilityView;
  heldForName: string | null;
  isFeedStale: boolean;
  onReserve: () => void;
}

export function ReserveAction({
  facility,
  heldForName,
  isFeedStale,
  onReserve,
}: ReserveActionProps) {
  if (heldForName) {
    return <Tag>Reserved for {heldForName}</Tag>;
  }

  const getDisabledReason = (
    facility: FacilityView,
    isFeedStale: boolean,
  ): string | null => {
    if (isFeedStale)
      return "Reserving is currently unavailable. Try again in a couple of minutes.";
    if (facility.status === "closed") return "Facility is closed.";
    if (facility.status === "full") return "No free spaces right now.";
    return null;
  };

  const reason = getDisabledReason(facility, isFeedStale);
  if (reason) {
    return (
      <div className="reserve-action">
        <Button variant="primary" disabled>
          Reserve
        </Button>
        <span className="reserve-action__reason">{reason}</span>
      </div>
    );
  }

  return (
    <Button variant="primary" onClick={onReserve}>
      Reserve
    </Button>
  );
}
