import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(
  value?: string | Date | null,
  withTime: boolean = true
) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = withTime
    ? {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : {
        year: "numeric",
        month: "short",
        day: "numeric",
      };

  return date.toLocaleString(undefined, options);
}

export function formatDate(value?: string | Date | null) {
  return formatDateTime(value, false);
}

export function formatDurationMinutes(
  totalMinutes: number | null | undefined
): string {
  if (totalMinutes == null) return "-";
  const minutes = Math.round(totalMinutes);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}
