import GoogleMapReact from "google-map-react";

type LatLng = {
  lat: number;
  lng: number;
};

type GoogleMapPickerProps = {
  value?: string;
  onChange: (coords: LatLng) => void;
  center?: LatLng;
  zoom?: number;
  height?: string;
};

const parseCoordinates = (value?: string): LatLng | null => {
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

const DefaultCenter: LatLng = { lat: 34.8021, lng: 38.9968 };

const Marker = () => (
  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-white" />
);

const GoogleMapPicker = ({
  value,
  onChange,
  center,
  zoom = 10,
  height = "300px",
}: GoogleMapPickerProps) => {
  const selectedCoords = parseCoordinates(value);
  const mapCenter = selectedCoords ?? center ?? DefaultCenter;

  return (
    <div className="relative w-full" style={{ height }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAP_KEY ?? "" }}
        defaultCenter={DefaultCenter}
        center={mapCenter}
        defaultZoom={zoom}
        onClick={(event: any) => {
          if (event?.lat && event?.lng) {
            onChange({ lat: event.lat, lng: event.lng });
          }
        }}
      >
        {selectedCoords ? (
          <Marker lat={selectedCoords.lat} lng={selectedCoords.lng} />
        ) : null}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMapPicker;
