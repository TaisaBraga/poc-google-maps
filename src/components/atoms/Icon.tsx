import type { ReactNode } from "react";
import "./Icon.css";
export function Icon({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`icon ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}
