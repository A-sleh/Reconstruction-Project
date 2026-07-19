import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LandMap } from "@/components/shared/LandMap";
import type { LatLng } from "@/lib/helpers";

type BorderFieldProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
};

function parseBorderString(border: string[]): LatLng[] {
  return border
    .map((s) => {
      const parts = s.split(",").map((p) => p.trim());
      if (parts.length !== 2) return null;
      const lat = Number(parts[0]);
      const lng = Number(parts[1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return { lat, lng };
    })
    .filter((p): p is LatLng => p !== null);
}

function toBorderString(points: LatLng[]): string[] {
  return points.map((p) => `${p.lat},${p.lng}`);
}

export default function BorderField({
  value,
  onChange,
  disabled = false,
  error,
}: BorderFieldProps) {
  const { t } = useTranslation();
  const points = useMemo(() => parseBorderString(value), [value]);

  const handleChange = useCallback(
    (next: LatLng[]) => {
      onChange(toBorderString(next));
    },
    [onChange],
  );

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {t("investor.border-label")}
        </label>
        {points.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {t("investor.border-points", { count: points.length })}
          </span>
        )}
      </div>

      <LandMap
        mode="edit"
        value={points}
        onChange={handleChange}
        height="350px"
        disabled={disabled}
      />

      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        {t("investor.border-hint")}
      </p>
    </div>
  );
}
