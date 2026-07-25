import { MapPin, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LandMap from "@/components/shared/LandMap/LandMap";
import { Button } from "@/components/ui/button";
import type { LandDetail } from "../api/types";
import { type LatLng } from "@/lib/helpers";

interface LandHeroSectionProps {
  land: LandDetail;
}

export default function LandHeroSection({ land }: LandHeroSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const polygon: LatLng[] =
    land.border?.map((pt) => ({
      lat: pt.latitude,
      lng: pt.longitude,
    })) ?? [];

  const center: [number, number] = land.location
    ? [land.location.latitude, land.location.longitude]
    : polygon.length > 0
      ? [
          polygon.reduce((sum, pt) => sum + pt.lat, 0) / polygon.length,
          polygon.reduce((sum, pt) => sum + pt.lng, 0) / polygon.length,
        ]
      : [34.8021, 38.9968];

  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-lg overflow-hidden border border-border">
      {land.coverImageUrl && (
        <img
          src={land.coverImageUrl}
          alt={land.name}
          className="absolute inset-0 h-full w-full object-cover opacity-40 z-10"
        />
      )}
      <div className="absolute inset-0 z-10">
        <LandMap
          mode="show"
          zoom={15}
          center={{ lat: center[0], lng: center[1] }}
          polygon={polygon}
          className="h-full w-full z-30"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-40 text-white">
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 text-white hover:bg-white/20 gap-1.5 -ms-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("investor.back")}
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {land.name}
        </h1>
        <div className="flex items-center gap-1.5 text-sm text-white/80 mt-1">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{land.address}</span>
        </div>
      </div>
    </div>
  );
}
