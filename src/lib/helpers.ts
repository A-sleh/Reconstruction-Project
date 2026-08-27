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
      "noopener,noreferrer",
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

export function parsingTheStringToEnum<T>(meta: Object, labelParam: string): T {
  const labelAsEnum = Object.entries(meta).find(
    ([, label]) => label === labelParam,
  );
  return labelAsEnum ? (Number(labelAsEnum[0]) as T) : (0 as T);
}

export function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat,
      yi = polygon[i].lng;
    const xj = polygon[j].lat,
      yj = polygon[j].lng;
    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function getDominImageURL(imageSuffix: string) {
  if (
    imageSuffix == "" ||
    !imageSuffix ||
    imageSuffix == undefined ||
    imageSuffix == null
  )
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
  return import.meta.env.VITE_BASE_IMAGE_URL + imageSuffix;
}
