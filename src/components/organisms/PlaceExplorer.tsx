import { useMemo } from "react";
import { categories } from "../../data";
import type { Category, Place } from "../../types";
import { CategoryChip } from "../atoms/CategoryChip";
import { PlaceCard } from "../molecules/PlaceCard";
import "./PlaceExplorer.css";
export function PlaceExplorer({
  places,
  category,
  setCategory,
  selected,
  onSelect,
  loading,
}: {
  places: Place[];
  category: Category;
  setCategory: (category: Category) => void;
  selected: string | null;
  onSelect: (place: Place) => void;
  loading: boolean;
}) {
  const counts = useMemo(
    () => ({
      all: places.length,
      pharmacy: places.filter((p) => p.category === "pharmacy").length,
      supermarket: places.filter((p) => p.category === "supermarket").length,
      cafe: places.filter((p) => p.category === "cafe").length,
    }),
    [places],
  );
  const visible =
    category === "all"
      ? places
      : places.filter((place) => place.category === category);
  return (
    <aside className="explorer" aria-label="Comércios próximos">
      <div className="explorer-head">
        <div>
          <span className="eyebrow">AO SEU REDOR</span>
          <h2>Encontre por perto</h2>
          <p>Pequenas descobertas, a poucos passos.</p>
        </div>
        <span className="result-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "local" : "locais"}
        </span>
      </div>
      <div className="category-list" aria-label="Filtrar por categoria">
        {categories.map((item) => (
          <CategoryChip
            key={item.id}
            {...item}
            active={category === item.id}
            onClick={setCategory}
          />
        ))}
      </div>
      <div className="places-heading">
        <h3>
          {category === "all"
            ? "Mais próximos"
            : categories.find((item) => item.id === category)?.label}
        </h3>
        <span>Por distância</span>
      </div>
      <div className="places-list" aria-live="polite">
        {loading ? (
          <p className="empty-state">Buscando comércios próximos…</p>
        ) : visible.length ? (
          visible.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              active={selected === place.id}
              onSelect={onSelect}
            />
          ))
        ) : (
          <p className="empty-state">
            Nenhum local encontrado nesta categoria em até 2 km.
          </p>
        )}
      </div>
      <p className="explorer-foot">
        {counts.all > 0
          ? "Distâncias calculadas a partir da sua localização."
          : "Ative a localização para descobrir lugares perto de você."}
      </p>
    </aside>
  );
}
