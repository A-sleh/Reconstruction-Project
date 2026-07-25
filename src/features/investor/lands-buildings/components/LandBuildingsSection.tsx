import { useTranslation } from "react-i18next";
import { Building2, MapPin, Layers, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LandDetail, Building } from "../api/types";

interface LandBuildingsSectionProps {
  land: LandDetail;
}

function BuildingCard({ building }: { building: Building }) {
  const { t } = useTranslation();

  return (
    <div className="border border-border rounded-lg bg-white overflow-hidden hover:shadow-card transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {building.coverImageUrl && (
          <div className="sm:w-48 h-32 sm:h-auto shrink-0 overflow-hidden">
            <img
              src={building.coverImageUrl}
              alt={building.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground text-sm">
              {building.name}
            </h4>
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {building.buildingType}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{building.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-3 w-3 shrink-0" />
              <span>
                {building.area.toLocaleString()} {t("investor.squareMeters")}
              </span>
            </div>
          </div>

          {building.buildingParts && building.buildingParts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {building.buildingParts.map((part) => (
                <span
                  key={part.id}
                  className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                >
                  {part.buildingPartType}: {part.area.toLocaleString()} {t("investor.squareMeters")}
                </span>
              ))}
            </div>
          )}

          {building.attachments && building.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {building.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  {att.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandBuildingsSection({
  land,
}: LandBuildingsSectionProps) {
  const { t } = useTranslation();
  const buildings = land.buildings ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {t("investor.buildings")}
          </h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {buildings.length}
        </Badge>
      </div>

      {buildings.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-8 text-center">
          <Building2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("investor.noBuildings")}
          </p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {buildings.map((building, idx) => (
            <AccordionItem
              key={building.buildingId}
              value={`building-${building.buildingId}`}
              className="border border-border rounded-lg overflow-hidden bg-white data-[state=open]:shadow-card transition-shadow"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-start">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {building.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {building.buildingType} &middot;{" "}
                      {building.area.toLocaleString()} {t("investor.squareMeters")}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <BuildingCard building={building} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
