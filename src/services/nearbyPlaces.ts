import type { Place } from "../types";

const SEARCH_RADIUS_KM = 2;
const SEARCH_TYPES = ["pharmacy", "supermarket", "grocery_store", "cafe"];
const nearbySearchCache = new Map<string, Promise<Place[]>>();

function getDistanceInKm(
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(destination.lat - origin.lat);
  const longitudeDelta = toRadians(destination.lng - origin.lng);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(destination.lat)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getCategory(primaryType: string | null | undefined): Place["category"] | null {
  if (primaryType === "pharmacy") return "pharmacy";
  if (primaryType === "supermarket" || primaryType === "grocery_store") {
    return "supermarket";
  }
  if (primaryType === "cafe") return "cafe";
  return null;
}

export function findNearbyPlaces(
  center: google.maps.LatLngLiteral,
  distanceOrigin: google.maps.LatLngLiteral = center,
) {
  const cacheKey = `${center.lat.toFixed(4)},${center.lng.toFixed(4)}:${distanceOrigin.lat.toFixed(4)},${distanceOrigin.lng.toFixed(4)}`;
  const cachedSearch = nearbySearchCache.get(cacheKey);
  if (cachedSearch) return cachedSearch;

  const search = google.maps.places.Place.searchNearby({
    fields: [
      "id",
      "displayName",
      "primaryType",
      "location",
      "formattedAddress",
      "rating",
    ],
    includedPrimaryTypes: SEARCH_TYPES,
    locationRestriction: { center, radius: SEARCH_RADIUS_KM * 1000 },
    maxResultCount: 20,
    rankPreference: google.maps.places.SearchNearbyRankPreference.DISTANCE,
  }).then(({ places }) =>
    places
      .flatMap((place) => {
        if (!place.id || !place.location) return [];

        const category = getCategory(place.primaryType);
        if (!category) return [];

        const position = {
          lat: place.location.lat(),
          lng: place.location.lng(),
        };
        const searchDistance = getDistanceInKm(center, position);
        if (searchDistance > SEARCH_RADIUS_KM) return [];
        const distance = getDistanceInKm(distanceOrigin, position);

        return [
          {
            id: place.id,
            name: place.displayName ?? "Comércio próximo",
            category,
            address: place.formattedAddress ?? "Endereço indisponível",
            distance,
            position,
            rating: place.rating ?? undefined,
          },
        ];
      })
      .sort((first, second) => first.distance - second.distance),
  );

  nearbySearchCache.set(cacheKey, search);
  return search;
}
