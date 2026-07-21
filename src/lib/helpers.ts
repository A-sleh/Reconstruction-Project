import { ILoncation } from "@/features/investor/lands-buildings/api/types";

export type LatLng = {
  lat: number;
  lng: number;
};

export const parseCoordinates = (value?: string): LatLng | null => {
  if (!value) return null;
  const parts = value.split(",").map((part) => part.trim());
  if (parts.length !== 2) return null;

  const lat = Number(parts[0]);
  const lng = Number(parts[1]);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  return null;
};

export const openInGoogleMaps = (location?: string) => {
  const coords = parseCoordinates(location);
  if (coords) {
    window.open(
      `https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
};


export const fmtCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatDate = (
  date: Date | string,
  isArabic = false,
  options?: Intl.DateTimeFormatOptions,
) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const locale = isArabic ? "ar-SA" : "en-US";
  return d.toLocaleDateString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
};

export function locationToString(loc: ILoncation): string {
  return `${loc.longitude},${loc.latitude}`;
}

export function stringToLocation(str: string): ILoncation {
  const [longitude, latitude] = str.split(",").map(Number);
  return { longitude, latitude };
}

