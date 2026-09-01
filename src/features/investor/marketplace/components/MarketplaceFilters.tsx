import { Search, ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "../mock/deals";
import type { DealKind } from "../api/types";

export type TypeFilter = "all" | DealKind;

export const MAX_PRICE = 10_000_000;
export const MAX_AREA = 15_000;

interface Props {
  query: string;
  typeFilter: TypeFilter;
  verifiedOnly: boolean;
  priceRange: [number, number];
  areaRange: [number, number];
  onQueryChange: (value: string) => void;
  onTypeChange: (value: TypeFilter) => void;
  onVerifiedChange: (value: boolean) => void;
  onPriceChange: (value: [number, number]) => void;
  onAreaChange: (value: [number, number]) => void;
  onReset: () => void;
}

function MarketplaceFilters({
  query,
  typeFilter,
  verifiedOnly,
  priceRange,
  areaRange,
  onQueryChange,
  onTypeChange,
  onVerifiedChange,
  onPriceChange,
  onAreaChange,
  onReset,
}: Props) {
  const { t } = useTranslation();

  return (
    <Card className="shadow-elegant">
      <CardContent className="space-y-6 p-5">
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("marketplace.filters.search")}
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t("marketplace.filters.searchPlaceholder")}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("marketplace.filters.propertyType")}
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["all", "land", "building"] as TypeFilter[]).map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? "default" : "outline"}
                size="sm"
                className="capitalize"
                onClick={() => onTypeChange(type)}
              >
                {t(`marketplace.filters.typeOptions.${type}`)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("marketplace.filters.priceRange")}
            </Label>
            <span className="text-xs font-medium">
              {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}
            </span>
          </div>
          <Slider
            min={0}
            max={MAX_PRICE}
            step={50_000}
            value={priceRange}
            onValueChange={(value) => onPriceChange([value[0], value[1]])}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("marketplace.filters.areaRange")}
            </Label>
            <span className="text-xs font-medium">
              {areaRange[0].toLocaleString()} – {areaRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            min={0}
            max={MAX_AREA}
            step={100}
            value={areaRange}
            onValueChange={(value) => onAreaChange([value[0], value[1]])}
          />
        </div>

        <Separator />

        <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {t("marketplace.filters.verifiedOnly")}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("marketplace.filters.verifiedHint")}
            </p>
          </div>
          <Switch checked={verifiedOnly} onCheckedChange={onVerifiedChange} />
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
          <X className="ml-1.5 h-3.5 w-3.5" />
          {t("marketplace.filters.reset")}
        </Button>
      </CardContent>
    </Card>
  );
}

export default MarketplaceFilters;