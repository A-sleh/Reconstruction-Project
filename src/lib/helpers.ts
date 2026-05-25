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

export const fmtCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
