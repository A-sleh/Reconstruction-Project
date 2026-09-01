import { useMemo, useState } from "react";
import { MOCK_DEAL_LISTINGS } from "@/features/investor/marketplace/mock/deals";
import type { DealListing } from "@/features/investor/marketplace/api/types";
import DealDetailDrawer from "@/features/investor/marketplace/components/DealDetailDrawer";
import MarketplaceFilters, {
  MAX_AREA,
  MAX_PRICE,
  type TypeFilter,
} from "@/features/investor/marketplace/components/MarketplaceFilters";
import MarketplaceHeader from "@/features/investor/marketplace/components/MarketplaceHeader";
import MarketPlaceSection from "@/features/investor/marketplace/components/MarketPlaceSection";

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, MAX_AREA]);
  const [sort, setSort] = useState("newest");
  const [active, setActive] = useState<DealListing | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = MOCK_DEAL_LISTINGS.filter((deal) => {
      if (typeFilter !== "all" && deal.kind !== typeFilter) return false;
      if (verifiedOnly && !deal.isValidated) return false;
      if (deal.price < priceRange[0] || deal.price > priceRange[1]) return false;
      if (deal.dealArea < areaRange[0] || deal.dealArea > areaRange[1]) return false;
      if (!q) return true;
      const hay =
        deal.kind === "land"
          ? `${deal.land?.location} ${deal.land?.address} ${deal.land?.zoning}`
          : `${deal.building?.city} ${deal.building?.address} ${deal.building?.streetName} ${deal.building?.buildingType}`;
      return hay.toLowerCase().includes(q);
    });
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "area-desc":
        return [...list].sort((a, b) => b.dealArea - a.dealArea);
      default:
        return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
  }, [query, typeFilter, verifiedOnly, priceRange, areaRange, sort]);

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setVerifiedOnly(false);
    setPriceRange([0, MAX_PRICE]);
    setAreaRange([0, MAX_AREA]);
  };

  const verifiedCount = filtered.filter((deal) => deal.isValidated).length;

  return (
    <div className="space-y-6">
      <MarketplaceHeader totalListings={filtered.length} verifiedCount={verifiedCount} />

      <div className="flex gap-4">
        <aside className="flex-1">
          <MarketplaceFilters
            query={query}
            typeFilter={typeFilter}
            verifiedOnly={verifiedOnly}
            priceRange={priceRange}
            areaRange={areaRange}
            onQueryChange={setQuery}
            onTypeChange={setTypeFilter}
            onVerifiedChange={setVerifiedOnly}
            onPriceChange={setPriceRange}
            onAreaChange={setAreaRange}
            onReset={resetFilters}
          />
        </aside>

        <MarketPlaceSection
          listings={filtered}
          sort={sort}
          onSortChange={setSort}
          onReset={resetFilters}
          onOpenDeal={setActive}
        />
      </div>

      <DealDetailDrawer deal={active} onClose={() => setActive(null)} />
    </div>
  );
}