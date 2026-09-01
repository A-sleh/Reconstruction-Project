import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EZoningType,
  ZONING_LABELS,
} from "@/features/investor/lands-buildings/api/types";
import type { ProjectBuilding } from "../../api/types";

const BuildingInfoCard = ({ building }: { building?: ProjectBuilding }) => {
  const { t } = useTranslation();

  if (!building) return null;

  const hasHttp = building.coverImage?.url?.startsWith("http");
  const imgSrc = hasHttp ? building.coverImage!.url : null;

  const zoneLabel =
    typeof building.zoneType === "number"
      ? (ZONING_LABELS[building.zoneType as EZoningType] ?? building.zoneType)
      : building.zoneType;

  const rows: { label: string; value: ReactNode }[] = [
    {
      label: t("project.details.reference.building.name"),
      value: building.name || "—",
    },
    {
      label: t("project.details.reference.building.type"),
      value: (
        <Badge variant="outline" className="text-primary">
          {building.buildingType}
        </Badge>
      ),
    },
    {
      label: t("project.details.reference.building.city"),
      value: building.city || "—",
    },
    {
      label: t("project.details.reference.building.street"),
      value: building.streetName || "—",
    },
    {
      label: t("project.details.reference.building.address"),
      value: building.address || "—",
    },
    {
      label: t("project.details.reference.building.area"),
      value: `${building.area.toLocaleString()} m²`,
    },
    {
      label: t("project.details.reference.building.readiness"),
      value: building.readinessLevel || "—",
    },
    {
      label: t("project.details.reference.building.orientation"),
      value: building.orientation || "—",
    },
    {
      label: t("project.details.reference.building.zoneType"),
      value: zoneLabel || "—",
    },
    {
      label: t("project.details.reference.building.parts"),
      value: String(building.buildingParts?.length ?? 0),
    },
    {
      label: t("investor.borderPoints"),
      value: String(building.border?.length ?? 0),
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </span>
          {t("project.details.reference.building.title")}
        </CardTitle>
        <CardDescription>
          {t("project.details.reference.building.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={building.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-emerald-soft text-muted-foreground">
                <Building2 className="h-12 w-12" />
              </div>
              <span className="absolute bottom-2 left-2 rounded bg-muted/80 px-2 py-0.5 text-xs text-muted-foreground">
                {t("project.details.reference.building.noImage")}
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {row.label}
              </p>
              <p className="text-sm font-medium text-foreground">{row.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingInfoCard;
