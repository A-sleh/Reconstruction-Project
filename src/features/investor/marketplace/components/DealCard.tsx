import type { ReactNode } from "react";
import { ArrowUpRight, Building2, Compass, Layers, MapPin, Ruler, ShieldCheck, Trees } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../mock/deals";
import type { DealListing } from "../api/types";

interface Props {
  deal: DealListing;
  onOpen: () => void;
}

function DealCard({ deal, onOpen }: Props) {
  const { t } = useTranslation();
  const isLand = deal.kind === "land";
  const title = isLand
    ? deal.land!.location
    : `${deal.building!.buildingType} · ${deal.building!.city}`;
  const sub = isLand ? deal.land!.address : deal.building!.address;

  return (
    <Card className="group overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={deal.image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge
            className={
              isLand
                ? "bg-amber-500 text-white hover:bg-amber-500"
                : "bg-sky-600 text-white hover:bg-sky-600"
            }
          >
            {isLand ? <Trees className="ml-1 h-3 w-3" /> : <Building2 className="ml-1 h-3 w-3" />}
            {isLand ? t("marketplace.card.land") : t("marketplace.card.building")}
          </Badge>
          {deal.isValidated && (
            <Badge className="gap-1 bg-emerald-600 text-white shadow-md hover:bg-emerald-600">
              <ShieldCheck className="h-3 w-3" />
              {t("marketplace.card.verifiedOwner")}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-lg font-semibold leading-tight drop-shadow">{title}</div>
          <div className="flex items-center gap-1 text-xs text-white/85">
            <MapPin className="h-3 w-3" /> {sub}
          </div>
        </div>
      </div>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("marketplace.card.asking")}
            </div>
            <div className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(deal.price)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("marketplace.card.area")}
            </div>
            <div className="text-sm font-medium">
              {deal.dealArea.toLocaleString()} m²
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {isLand ? (
            <>
              <Spec
                icon={<Layers className="h-3.5 w-3.5" />}
                label={t("marketplace.detail.zoning")}
                value={deal.land!.zoning}
              />
              <Spec
                icon={<Compass className="h-3.5 w-3.5" />}
                label={t("marketplace.detail.accessibility")}
                value={deal.land!.accessibility}
              />
            </>
          ) : (
            <>
              <Spec
                icon={<Layers className="h-3.5 w-3.5" />}
                label={t("marketplace.detail.zoneType")}
                value={deal.building!.zoneType}
              />
              <Spec
                icon={<Ruler className="h-3.5 w-3.5" />}
                label={t("marketplace.detail.readiness")}
                value={deal.building!.readinessLevel}
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-muted/40 px-2.5 py-1.5 text-[11px] font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {deal.lat.toFixed(4)}, {deal.lng.toFixed(4)}
          </span>
          <span>GPS</span>
        </div>

        <Button onClick={onOpen} className="w-full" variant="default">
          {t("marketplace.card.viewDetails")}
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-muted/50 p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-0.5 truncate text-xs font-medium" title={value}>
        {value}
      </div>
    </div>
  );
}

export default DealCard;