import type { Place } from "../../types";
import "./PlacePin.css";
export function PlacePin({
  place,
  selected,
  onClick,
}: {
  place: Place;
  selected: boolean;
  onClick: () => void;
}) {
  const symbol =
    place.category === "pharmacy"
      ? "✚"
      : place.category === "supermarket"
        ? "▤"
        : "☕";
  return (
    <button
      className={`place-pin pin-${place.category} ${selected ? "selected" : ""}`}
      onClick={onClick}
      tabIndex={-1}
      aria-label={`${place.name}, ${place.distance.toFixed(1)} quilômetros`}
      title={place.name}
    >
      {symbol}
    </button>
  );
}
