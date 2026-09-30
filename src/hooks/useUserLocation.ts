import { useCallback, useState } from "react";

export function useUserLocation() {
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Seu navegador não oferece suporte à localização.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setLoading(false);
      },
      (result) => {
        setError(
          result.code === result.PERMISSION_DENIED
            ? "A localização foi bloqueada. Ative a permissão nas configurações do navegador."
            : "Não foi possível encontrar sua localização. Tente novamente.",
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, []);
  return { position, error, loading, requestLocation };
}
