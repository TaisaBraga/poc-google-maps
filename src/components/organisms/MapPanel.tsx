import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import type { Place } from "../../types";
import { PlacePin } from "../atoms/PlacePin";
import { findNearbyPlaces } from "../../services/nearbyPlaces";
import "./MapPanel.css";

function NearbySearch({
  center,
  onResults,
  onSearchError,
}: {
  center: google.maps.LatLngLiteral;
  onResults: (places: Place[]) => void;
  onSearchError: (message: string) => void;
}) {
  useEffect(() => {
    let cancelled = false;

    void findNearbyPlaces(center)
      .then((places) => {
        if (cancelled) return;
        onSearchError("");
        onResults(places);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        onResults([]);
        console.error("Nearby Search failed:", error);
        const details = error instanceof Error ? error.message : String(error);
        const isQuotaError = /RESOURCE_EXHAUSTED|quota exceeded/i.test(details);

        onSearchError(
          isQuotaError
            ? "A cota diária de busca do Google Places foi esgotada. A busca foi reduzida para uma consulta por localização. Aguarde a renovação da cota ou ajuste o limite SearchNearbyRequest no Google Cloud."
            : `Não foi possível buscar locais. Confira se a Places API (New) está ativada e se a chave tem permissão. ${details}`,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [center, onResults, onSearchError]);

  return null;
}
export function MapPanel({
  center,
  places,
  selected,
  onSelect,
  onResults,
  onSearchError,
  searchError,
}: {
  center: google.maps.LatLngLiteral;
  places: Place[];
  selected: Place | null;
  onSelect: (place: Place | null) => void;
  onResults: (places: Place[]) => void;
  onSearchError: (message: string) => void;
  searchError: string;
}) {
  return (
    <section
      className="map-panel"
      aria-label="Mapa de comércios próximos"
      aria-describedby="map-keyboard-help"
    >
      <Map
        defaultCenter={center}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID"}
      >
        <NearbySearch
          center={center}
          onResults={onResults}
          onSearchError={onSearchError}
        />
        <AdvancedMarker position={center} title="Sua localização">
          <div className="user-marker">
            <span />
            <i>Você está aqui</i>
          </div>
        </AdvancedMarker>
        {places.map((place) => (
          <AdvancedMarker
            key={place.id}
            position={place.position}
            title={place.name}
            onClick={() => onSelect(place)}
            ref={(marker) => {
              if (marker) marker.tabIndex = -1;
            }}
          >
            <PlacePin
              place={place}
              selected={selected?.id === place.id}
              onClick={() => onSelect(place)}
            />
          </AdvancedMarker>
        ))}
      </Map>
      <p className="sr-only" id="map-keyboard-help">
        Para percorrer os estabelecimentos com teclado, use a visualização Lista.
        Os pins do mapa podem ser ativados com o mouse ou toque.
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {selected ? `${selected.name} selecionado.` : "Nenhum local selecionado."}
      </p>
      {searchError && (
        <div className="map-error" role="alert">
          {searchError}
        </div>
      )}
      <div className="map-legend">
        <span>
          <i className="legend-dot pharmacy" />
          Farmácia
        </span>
        <span>
          <i className="legend-dot supermarket" />
          Mercado
        </span>
        <span>
          <i className="legend-dot cafe" />
          Café
        </span>
      </div>
      <div className="radius-label">
        ◎ <span>Raio de 2 km</span>
      </div>
    </section>
  );
}
