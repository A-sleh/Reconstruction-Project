import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Building2, MapPin, Pencil, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, type Property } from "@/data/investor/mock";
import { paths } from "@/config/paths";

const statusColor: Record<Property["status"], string> = {
  Operational: "bg-emerald/10 text-emerald border-emerald/20",
  Leased: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Under Construction": "bg-gold/10 text-gold border-gold/30",
  Vacant: "bg-muted text-muted-foreground border-border",
};

function PropertyCard({ p }: { p: Property }) {
  const { t } = useTranslation();

  return (
    <Card className="group overflow-hidden shadow-card border-border/60 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
        <Badge
          className={`absolute top-3 left-3 border ${statusColor[p.status]}`}
          variant="outline"
        >
          {p.status}
        </Badge>
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-white/90 text-primary border-0 capitalize"
          >
            {p.type === "building" ? (
              <Building2 className="h-3 w-3 mr-1" />
            ) : (
              <Layers className="h-3 w-3 mr-1" />
            )}
            {p.type}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-semibold text-lg leading-tight">{p.name}</h3>
          <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
            <MapPin className="h-3 w-3" /> {p.location}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("investor.valuation")}
            </p>
            <p className="font-semibold text-foreground">
              {formatCurrency(p.value)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("investor.area")}
            </p>
            <p className="font-semibold text-foreground">
              {p.area.toLocaleString()} {t("investor.squareMeters")}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Link to={paths.app.investor.landBuildingDetails.getHref(p.id)}>
              {t("investor.view")}
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Pencil className="h-3.5 w-3.5" /> {t("investor.edit")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
