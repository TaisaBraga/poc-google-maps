import { useEffect, useRef, useState } from "react";
import type { Place } from "../../types";
import { PlaceCard } from "../molecules/PlaceCard";
import "./PlaceCarousel.css";

export function PlaceCarousel({
  places,
  selected,
  onSelect,
}: {
  places: Place[];
  selected: string | null;
  onSelect: (place: Place) => void;
}) {
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const trackRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const selectedIndex = places.findIndex((place) => place.id === selected);
  const tabStopIndex =
    selectedIndex >= 0
      ? selectedIndex
      : Math.min(focusedIndex, Math.max(0, places.length - 1));

  useEffect(() => {
    if (!selected) return;
    let frame = 0;
    frame = requestAnimationFrame(() => {
      const track = trackRef.current;
      const card = cardRefs.current.get(selected);
      if (!track || !card) return;

      const trackBounds = track.getBoundingClientRect();
      const cardBounds = card.getBoundingClientRect();
      const cardLeft = track.scrollLeft + cardBounds.left - trackBounds.left;
      const targetLeft =
        cardLeft - (track.clientWidth - card.clientWidth) / 2;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      track.scrollTo({
        left: targetLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [selected, selectedIndex]);

  function handleCardKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + places.length) % places.length;
    const nextPlace = places[nextIndex];
    if (!nextPlace) return;

    setFocusedIndex(nextIndex);
    onSelect(nextPlace);
    requestAnimationFrame(() => {
      cardRefs.current
        .get(nextPlace.id)
        ?.querySelector("button")
        ?.focus({ preventScroll: true });
    });
  }

  return (
    <section className="place-carousel" aria-label="Locais mostrados no mapa">
      {places.length ? (
        <div
          className="carousel-track"
          role="radiogroup"
          aria-label="Seleção de um local próximo"
          aria-describedby="carousel-keyboard-help"
          ref={trackRef}
        >
          {places.map((place, index) => (
            <div
              key={place.id}
              className="carousel-item"
              ref={(element) => {
                if (element) cardRefs.current.set(place.id, element);
                else cardRefs.current.delete(place.id);
              }}
            >
              <PlaceCard
                place={place}
                active={selected === place.id}
                selectionSemantics="radio"
                onSelect={onSelect}
                tabIndex={index === tabStopIndex ? 0 : -1}
                onKeyDown={(event) => handleCardKeyDown(event, index)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="carousel-empty">Nenhum local encontrado em até 2 km.</p>
      )}
      <p className="sr-only" id="carousel-keyboard-help">
        Use as setas esquerda e direita para selecionar outro local. A seleção
        funciona nos dois sentidos.
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedIndex >= 0
          ? `${places[selectedIndex].name} selecionado. ${selectedIndex + 1} de ${places.length}.`
          : "Nenhum local selecionado."}
      </p>
    </section>
  );
}
