import { AiOutlineEnvironment } from "react-icons/ai";
import Model from "./Model";
import { useTranslation } from "react-i18next";
import GoogleMapPicker from "../GoogleMapPicker";
import { LatLng, parseCoordinates } from "@/utils/helpers";
import { useEffect, useState } from "react";

interface IPickCoordsFromMap {
  value: string;
  setValue: (key: string, value: any) => void;
}

export const PickCoordsFromMap: React.FC<IPickCoordsFromMap> = ({
  value,
  setValue,
}) => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    parseCoordinates(value),
  );

  useEffect(() => {
    setSelectedLocation(parseCoordinates(value));
  }, [value]);

  const handleMapChange = (coords: LatLng) => {
    setSelectedLocation(coords);
    setValue(
      "companyLocation",
      `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
    );
  };

  return (
    <Model>
      <Model.Open opens="company-location-modal">
        <button
          type="button"
          title={t("auth.register.providor.openMapLocationButton")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-primary transition hover:bg-primary/10"
        >
          <AiOutlineEnvironment size={20} />
        </button>
      </Model.Open>

      <Model.Window
        name="company-location-modal"
        model_width="md:min-w-[60vw] md:max-w-[80vw]"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {t("auth.register.providor.companyLocationLabel")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("auth.register.providor.companyLocationModalDescription")}
              </p>
            </div>
          </div>

          <div className="h-[60vh] w-full rounded-xl overflow-hidden border border-border">
            <GoogleMapPicker
              value={value}
              onChange={handleMapChange}
              height="100%"
              center={selectedLocation ?? undefined}
              zoom={100}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                if (selectedLocation) {
                  setValue(
                    "companyLocation",
                    `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
                  );
                }
              }}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              {t("auth.register.providor.selectLocationButton")}
            </button>
            <Model.Close>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-red-400 hover:text-white"
              >
                {t("auth.register.cancel")}
              </button>
            </Model.Close>
          </div>
        </div>
      </Model.Window>
    </Model>
  );
};
