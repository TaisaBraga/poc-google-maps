import type { Category } from "./types";

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "all", label: "Todos", icon: "✦" },
  { id: "pharmacy", label: "Farmácias", icon: "✚" },
  { id: "supermarket", label: "Mercados", icon: "▤" },
  { id: "cafe", label: "Cafés", icon: "☕" },
];

export const categoryLabels = {
  pharmacy: "Farmácia",
  supermarket: "Mercado",
  cafe: "Café",
};
