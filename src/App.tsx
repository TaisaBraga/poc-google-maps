import { APIProvider } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categories } from "./data";
import { CategoryChip } from "./components/atoms/CategoryChip";
import { MapPanel } from "./components/organisms/MapPanel";
import { PlaceCarousel } from "./components/organisms/PlaceCarousel";
import { PlaceExplorer } from "./components/organisms/PlaceExplorer";
import { useUserLocation } from "./hooks/useUserLocation";
import type { Category, Place, ViewMode } from "./types";
import "./App.css";

function App() {
  const {
    position,
    error: locationError,
    loading,
    requestLocation,
  } = useUserLocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<ViewMode>("map");
  const [category, setCategory] = useState<Category>("all");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const updatePlaces = useCallback((results: Place[]) => setPlaces(results), []);
  const locationRequestStarted = useRef(false);
  const visiblePlaces = useMemo(
    () =>
      category === "all"
        ? places
        : places.filter((place) => place.category === category),
    [category, places],
  );

  function handleCategoryChange(nextCategory: Category) {
    setCategory(nextCategory);
    if (
      selectedPlace &&
      nextCategory !== "all" &&
      selectedPlace.category !== nextCategory
    ) {
      setSelectedPlace(null);
    }
  }

  useEffect(() => {
    if (!apiKey || locationRequestStarted.current) return;
    locationRequestStarted.current = true;
    requestLocation();
  }, [apiKey, requestLocation]);

  const content = (
    <main className="map-page">
      {position ? (
        <div>
          <nav className="view-toggle" aria-label="Alternar visualização">
            <button
              className={view === "map" ? "active" : ""}
              aria-pressed={view === "map"}
              onClick={() => setView("map")}
            >
              Mapa
            </button>
            <button
              className={view === "list" ? "active" : ""}
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              Lista
            </button>
          </nav>
          {view === "map" ? (
            <>
              <div
                className="map-category-filters"
                role="group"
                aria-label="Filtrar locais do mapa por categoria"
              >
                {categories.map((item) => (
                  <CategoryChip
                    key={item.id}
                    {...item}
                    active={category === item.id}
                    onClick={handleCategoryChange}
                  />
                ))}
                <span className="map-filter-count" aria-live="polite">
                  {visiblePlaces.length}{" "}
                  {visiblePlaces.length === 1 ? "local" : "locais"}
                </span>
              </div>
              <div className="map-stage">
                <MapPanel
                  center={position}
                  places={visiblePlaces}
                  selected={selectedPlace}
                  onSelect={setSelectedPlace}
                  onResults={updatePlaces}
                  onSearchError={setError}
                  searchError={error}
                />
                <PlaceCarousel
                  places={visiblePlaces}
                  selected={selectedPlace?.id ?? null}
                  onSelect={setSelectedPlace}
                />
              </div>
            </>
          ) : (
            <PlaceExplorer
              places={places}
              category={category}
              setCategory={handleCategoryChange}
              selected={selectedPlace?.id ?? null}
              onSelect={setSelectedPlace}
              loading={false}
            />
          )}
        </div>
      ) : (
        <section className="location-prompt" aria-label="Compartilhar localização" role={locationError ? "alert" : "status"}>
          <span aria-hidden="true">⌖</span>
          <p>{locationError || (loading ? "Aguardando autorização para acessar sua localização…" : "Solicitando autorização para acessar sua localização…")}</p>
          {locationError && (
            <button type="button" onClick={requestLocation} disabled={loading}>
              Tentar novamente
            </button>
          )}
        </section>
      )}
    </main>
  );

  return (
    <div className="app">
      {apiKey ? (
        <APIProvider
          apiKey={apiKey}
          libraries={["places"]}
          onError={(loadError) => {
            console.error("Google Maps failed to load:", loadError);
            setError(
              "O mapa não carregou. Confira a chave de API e se Maps JavaScript API está ativada.",
            );
          }}
        >
          {content}
        </APIProvider>
      ) : (
        content
      )}
    </div>
  );
}

export default App;
