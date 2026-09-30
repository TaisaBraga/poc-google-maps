import type { Category } from "../../types";
import "./CategoryChip.css";
export function CategoryChip({
  id,
  label,
  icon,
  active,
  onClick,
}: {
  id: Category;
  label: string;
  icon: string;
  active: boolean;
  onClick: (id: Category) => void;
}) {
  return (
    <button
      className={`category-chip ${active ? "is-active" : ""}`}
      onClick={() => onClick(id)}
      aria-pressed={active}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}
