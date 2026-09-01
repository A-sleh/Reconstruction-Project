import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DealListing } from "../api/types";
import DealCard from "./DealCard";

interface Props {
  listings: DealListing[];
  sort: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  onOpenDeal: (deal: DealListing) => void;
}

function MarketPlaceSection({ listings, sort, onSortChange, onReset, onOpenDeal }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 flex-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("marketplace.grid.showing", { count: listings.length })}
        </div>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("marketplace.grid.sort.newest")}</SelectItem>
            <SelectItem value="price-asc">{t("marketplace.grid.sort.priceAsc")}</SelectItem>
            <SelectItem value="price-desc">{t("marketplace.grid.sort.priceDesc")}</SelectItem>
            <SelectItem value="area-desc">{t("marketplace.grid.sort.areaDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Search className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">{t("marketplace.grid.empty")}</p>
            <Button variant="outline" size="sm" onClick={onReset}>
              {t("marketplace.filters.reset")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((deal) => (
            <DealCard key={deal.id} deal={deal} onOpen={() => onOpenDeal(deal)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MarketPlaceSection;