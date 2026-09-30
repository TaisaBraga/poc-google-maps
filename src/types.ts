export type Category = "all" | "pharmacy" | "supermarket" | "cafe";
export type Place = {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  address: string;
  distance: number;
  position: { lat: number; lng: number };
  rating?: number;
  openNow?: boolean;
};
export type ViewMode = "map" | "list";
