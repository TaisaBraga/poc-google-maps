import { categoryLabels } from "../../data";
import type { Place } from "../../types";
import "./PlaceCard.css";
export function PlaceCard({
  place,
  active,
  onSelect,
  tabIndex = 0,
  onKeyDown,
  selectionSemantics = "toggle",
}: {
  place: Place;
  active: boolean;
  onSelect: (place: Place) => void;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  selectionSemantics?: "toggle" | "radio";
}) {
  const icon =
    place.category === "pharmacy"
      ? "✚"
      : place.category === "supermarket"
        ? "▤"
        : "☕";
  return (
    <button
      className={`place-card ${active ? "active" : ""}`}
      onClick={() => onSelect(place)}
      aria-pressed={selectionSemantics === "toggle" ? active : undefined}
      role={selectionSemantics === "radio" ? "radio" : undefined}
      aria-checked={selectionSemantics === "radio" ? active : undefined}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <span className={`place-card-icon ${place.category}`} aria-hidden="true">
        {icon}
      </span>
      <span className="place-card-copy">
        <span className="place-card-top">
          <strong>{place.name}</strong>
          {place.rating && (
            <span className="rating">★ {place.rating.toFixed(1)}</span>
          )}
        </span>
        <span className="place-card-meta">
          {categoryLabels[place.category]} <span>·</span> {place.address}
        </span>
        <span className="place-card-bottom">
          <span className="distance">
            ↗{" "}
            {place.distance < 1
              ? `${Math.round(place.distance * 1000)} m`
              : `${place.distance.toFixed(1)} km`}
          </span>
          <span className={place.openNow ? "open" : "hours"}>
            {place.openNow === undefined
              ? "Perto de você"
              : place.openNow
                ? "Aberto agora"
                : "Fechado agora"}
          </span>
        </span>
      </span>
    </button>
  );
}
