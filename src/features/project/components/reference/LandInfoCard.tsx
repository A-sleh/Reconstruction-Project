import { MapPinned } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  EZoningType,
  ZONING_LABELS,
} from "@/features/investor/lands-buildings/api/types";
import type { LandDetail } from "@/features/investor/lands-buildings/api/types";

const LandInfoCard = ({
  land,
  isLoading,
}: {
  land?: LandDetail;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPinned className="h-4 w-4" />
          </span>
          {t("project.details.reference.land.title")}
        </CardTitle>
        <CardDescription>
          {t("project.details.reference.land.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : !land ? (
          <p className="text-sm text-muted-foreground">
            {t("project.details.reference.land.notLoaded")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("project.details.reference.land.name")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {land.name || "—"}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("project.details.reference.land.zoning")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {land.zoningType !== undefined
                  ? (ZONING_LABELS[Number(land.zoningType) as EZoningType] ??
                    land.zoningType)
                  : "—"}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("project.details.reference.land.area")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {land.area.toLocaleString()} m²
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("project.details.reference.land.address")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {land.address || "—"}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("project.details.reference.land.accessability")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {land.accessability ? t("investor.yes") : t("investor.no")}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("project.details.reference.land.validated")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {land.isValidated ? t("investor.yes") : t("investor.no")}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("project.details.reference.land.location")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {land.location
                  ? `${land.location.latitude.toFixed(6)}, ${land.location.longitude.toFixed(6)}`
                  : "—"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LandInfoCard;
