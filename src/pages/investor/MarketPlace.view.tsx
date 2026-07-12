import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Ruler,
  ShieldCheck,
  Building2,
  Trees,
  Compass,
  Layers,
  ArrowUpRight,
  Tag,
  Calendar,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { dealListings, formatCurrency, type DealListing } from "@/data/investor/mock";

const MAX_PRICE = 10_000_000;
const MAX_AREA = 15_000;

type TypeFilter = "all" | "land" | "building";

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
    const list = dealListings.filter((d) => {
      if (typeFilter !== "all" && d.kind !== typeFilter) return false;
      if (verifiedOnly && !d.isValidated) return false;
      if (d.price < priceRange[0] || d.price > priceRange[1]) return false;
      if (d.dealArea < areaRange[0] || d.dealArea > areaRange[1]) return false;
      if (!q) return true;
      const hay =
        d.kind === "land"
          ? `${d.land?.location} ${d.land?.address} ${d.land?.zoning}`
          : `${d.building?.city} ${d.building?.address} ${d.building?.streetName} ${d.building?.buildingType}`;
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

  const verifiedCount = filtered.filter((d) => d.isValidated).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties for Sale</h1>
          <p className="text-sm text-muted-foreground">
            Browse vetted land and building deals listed by verified investors.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
            <Tag className="h-3.5 w-3.5" />
            {filtered.length} listings
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            {verifiedCount} verified
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sticky filters */}
        <aside className="flex-1">
          <Card className="shadow-elegant">
            <CardContent className="space-y-6 p-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Search
                </Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="City, address, zone…"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Property Type
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["all", "land", "building"] as TypeFilter[]).map((t) => (
                    <Button
                      key={t}
                      variant={typeFilter === t ? "default" : "outline"}
                      size="sm"
                      className="capitalize"
                      onClick={() => setTypeFilter(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Price range
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
                  onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Area (m²)
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
                  onValueChange={(v) => setAreaRange([v[0], v[1]] as [number, number])}
                />
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Verified only
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Ownership documents approved by admin.
                  </p>
                </div>
                <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
              </div>

              <Button variant="ghost" size="sm" className="w-full" onClick={resetFilters}>
                <X className="mr-1.5 h-3.5 w-3.5" />
                Reset filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Grid */}
        <div className="space-y-4 flex-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> deal
              {filtered.length === 1 ? "" : "s"}
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="area-desc">Largest area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <Search className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No listings match your filters</p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((deal) => (
                <DealCard key={deal.id} deal={deal} onOpen={() => setActive(deal)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <DealDetailDrawer deal={active} onClose={() => setActive(null)} />
    </div>
  );
}

function DealCard({ deal, onOpen }: { deal: DealListing; onOpen: () => void }) {
  const isLand = deal.kind === "land";
  const title = isLand ? deal.land!.location : `${deal.building!.buildingType} · ${deal.building!.city}`;
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
            {isLand ? <Trees className="mr-1 h-3 w-3" /> : <Building2 className="mr-1 h-3 w-3" />}
            {isLand ? "LAND" : "BUILDING"}
          </Badge>
          {deal.isValidated && (
            <Badge className="gap-1 bg-emerald-600 text-white shadow-md hover:bg-emerald-600">
              <ShieldCheck className="h-3 w-3" />
              Verified Owner
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
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Asking</div>
            <div className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(deal.price)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Area</div>
            <div className="text-sm font-medium">{deal.dealArea.toLocaleString()} m²</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {isLand ? (
            <>
              <Spec icon={<Layers className="h-3.5 w-3.5" />} label="Zoning" value={deal.land!.zoning} />
              <Spec
                icon={<Compass className="h-3.5 w-3.5" />}
                label="Access"
                value={deal.land!.accessibility}
              />
            </>
          ) : (
            <>
              <Spec
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Zone"
                value={deal.building!.zoneType}
              />
              <Spec
                icon={<Ruler className="h-3.5 w-3.5" />}
                label="Readiness"
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
          View Details
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
  icon: React.ReactNode;
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

function DealDetailDrawer({
  deal,
  onClose,
}: {
  deal: DealListing | null;
  onClose: () => void;
}) {
  const open = !!deal;
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {deal && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    deal.kind === "land"
                      ? "bg-amber-500 text-white hover:bg-amber-500"
                      : "bg-sky-600 text-white hover:bg-sky-600"
                  }
                >
                  {deal.kind === "land" ? "LAND" : "BUILDING"}
                </Badge>
                {deal.isValidated ? (
                  <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600">
                    <ShieldCheck className="h-3 w-3" /> Verified Owner
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Pending verification
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-left text-xl">
                {deal.kind === "land"
                  ? deal.land!.location
                  : `${deal.building!.buildingType} · ${deal.building!.city}`}
              </SheetTitle>
              <SheetDescription className="text-left">
                {deal.kind === "land" ? deal.land!.address : deal.building!.address}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 overflow-hidden rounded-lg">
              <img src={deal.image} alt="" className="h-56 w-full object-cover" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="Asking Price" value={formatCurrency(deal.price)} accent />
              <Stat label="Deal Area" value={`${deal.dealArea.toLocaleString()} m²`} />
              <Stat label="Owner ID" value={deal.ownerId} mono />
              <Stat
                label="Listed"
                value={new Date(deal.createdAt).toLocaleDateString()}
                icon={<Calendar className="h-3 w-3" />}
              />
            </div>

            <Separator className="my-5" />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {deal.kind === "land" ? "Land Specification" : "Building Specification"}
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {deal.kind === "land" ? (
                  <>
                    <Row label="Location" value={deal.land!.location} />
                    <Row label="Area" value={`${deal.land!.area.toLocaleString()} m²`} />
                    <Row label="Zoning" value={deal.land!.zoning} />
                    <Row label="Accessibility" value={deal.land!.accessibility} />
                    <Row label="Borders" value={deal.land!.border} full />
                  </>
                ) : (
                  <>
                    <Row label="City" value={deal.building!.city} />
                    <Row label="Street" value={deal.building!.streetName} />
                    <Row label="Zone Type" value={deal.building!.zoneType} />
                    <Row label="Readiness" value={deal.building!.readinessLevel} />
                    <Row label="Orientation" value={deal.building!.orientation} />
                    <Row label="Building Type" value={deal.building!.buildingType} />
                    <Row label="Built Area" value={`${deal.building!.area.toLocaleString()} m²`} />
                    {deal.building!.landIdRef && (
                      <Row label="Linked Land" value={deal.building!.landIdRef} />
                    )}
                  </>
                )}
              </div>
            </div>

            <Separator className="my-5" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Geolocation
              </h3>
              <div className="relative h-40 overflow-hidden rounded-lg border bg-[linear-gradient(135deg,hsl(var(--muted))_25%,transparent_25%),linear-gradient(225deg,hsl(var(--muted))_25%,transparent_25%),linear-gradient(45deg,hsl(var(--muted))_25%,transparent_25%),linear-gradient(315deg,hsl(var(--muted))_25%,hsl(var(--background))_25%)] bg-[length:20px_20px]">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-elegant">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-[11px] font-mono">
                  {deal.lat.toFixed(5)}, {deal.lng.toFixed(5)}
                </div>
              </div>
            </div>

            {deal.terms && (
              <>
                <Separator className="my-5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Deal Terms
                  </h3>
                  <p className="text-sm text-foreground/90">{deal.terms}</p>
                </div>
              </>
            )}

            <div className="sticky bottom-0 -mx-6 mt-6 flex gap-2 border-t bg-background/95 px-6 py-3 backdrop-blur">
              <Button className="flex-1">Contact Investor</Button>
              <Button variant="outline" className="flex-1">
                Make Offer
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stat({
  label,
  value,
  accent,
  mono,
  icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div
        className={`mt-1 text-sm font-semibold ${
          accent ? "text-emerald-600 dark:text-emerald-400" : ""
        } ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

function Row({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`rounded-md bg-muted/40 px-3 py-2 ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}