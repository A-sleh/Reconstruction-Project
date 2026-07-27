import type { LatLng } from "@/lib/helpers";

export type { LatLng };

export type LandMapMode = "edit" | "show" | "select";

export type EditorTool =
  | "add"
  | "remove-vertex"
  | "move-all"
  | "move-single"
  | null;

export type LandMapOption = {
  id: string;
  label: string;
  polygon: LatLng[];
  metadata?: Record<string, unknown>;
};

export type LandMapProps = {
  mode: LandMapMode;
  center?: LatLng;
  zoom?: number;
  height?: string;

  value?: LatLng[];
  onChange?: (points: LatLng[]) => void;
  maxPoints?: number;

  polygon?: LatLng[];
  constraintPolygon?: LatLng[];
  fillColor?: string;
  borderColor?: string;

  options?: LandMapOption[];
  selectedId?: string;
  onSelect?: (id: string) => void;

  disabled?: boolean;
  className?: string;
};
