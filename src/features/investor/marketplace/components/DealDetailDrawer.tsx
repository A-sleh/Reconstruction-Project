import type { ReactNode } from "react";
import { Calendar, MapPin, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../mock/deals";
import type { DealListing } from "../api/types";

interface Props {
  deal: DealListing | null;
  onClose: () => void;
}

function DealDetailDrawer({ deal, onClose }: Props) {
  const { t } = useTranslation();
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
                  {deal.kind === "land"
                    ? t("marketplace.card.land")
                    : t("marketplace.card.building")}
                </Badge>
                {deal.isValidated ? (
                  <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600">
                    <ShieldCheck className="h-3 w-3" /> {t("marketplace.card.verifiedOwner")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    {t("marketplace.drawer.pendingVerification")}
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
              <Stat
                label={t("marketplace.detail.askingPrice")}
                value={formatCurrency(deal.price)}
                accent
              />
              <Stat
                label={t("marketplace.detail.dealArea")}
                value={`${deal.dealArea.toLocaleString()} m²`}
              />
              <Stat label={t("marketplace.detail.ownerId")} value={deal.ownerId} mono />
              <Stat
                label={t("marketplace.detail.listed")}
                value={new Date(deal.createdAt).toLocaleDateString()}
                icon={<Calendar className="h-3 w-3" />}
              />
            </div>

            <Separator className="my-5" />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {deal.kind === "land"
                  ? t("marketplace.detail.landSpec")
                  : t("marketplace.detail.buildingSpec")}
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {deal.kind === "land" ? (
                  <>
                    <Row label={t("marketplace.detail.location")} value={deal.land!.location} />
                    <Row
                      label={t("marketplace.detail.area")}
                      value={`${deal.land!.area.toLocaleString()} m²`}
                    />
                    <Row label={t("marketplace.detail.zoning")} value={deal.land!.zoning} />
                    <Row label={t("marketplace.detail.accessibility")} value={deal.land!.accessibility} />
                    <Row label={t("marketplace.detail.borders")} value={deal.land!.border} full />
                  </>
                ) : (
                  <>
                    <Row label={t("marketplace.detail.city")} value={deal.building!.city} />
                    <Row label={t("marketplace.detail.street")} value={deal.building!.streetName} />
                    <Row label={t("marketplace.detail.zoneType")} value={deal.building!.zoneType} />
                    <Row label={t("marketplace.detail.readiness")} value={deal.building!.readinessLevel} />
                    <Row label={t("marketplace.detail.orientation")} value={deal.building!.orientation} />
                    <Row label={t("marketplace.detail.buildingType")} value={deal.building!.buildingType} />
                    <Row
                      label={t("marketplace.detail.builtArea")}
                      value={`${deal.building!.area.toLocaleString()} m²`}
                    />
                    {deal.building!.landIdRef && (
                      <Row label={t("marketplace.detail.linkedLand")} value={deal.building!.landIdRef} />
                    )}
                  </>
                )}
              </div>
            </div>

            <Separator className="my-5" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("marketplace.detail.geolocation")}
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
                    {t("marketplace.detail.dealTerms")}
                  </h3>
                  <p className="text-sm text-foreground/90">{deal.terms}</p>
                </div>
              </>
            )}

            <div className="sticky bottom-0 -mx-6 mt-6 flex gap-2 border-t bg-background/95 px-6 py-3 backdrop-blur">
              <Button className="flex-1">{t("marketplace.drawer.contactInvestor")}</Button>
              <Button variant="outline" className="flex-1">
                {t("marketplace.drawer.makeOffer")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface StatProps {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
  icon?: ReactNode;
}

function Stat({ label, value, accent, mono, icon }: StatProps) {
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

interface RowProps {
  label: string;
  value: string;
  full?: boolean;
}

function Row({ label, value, full }: RowProps) {
  return (
    <div className={`rounded-md bg-muted/40 px-3 py-2 ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}

export default DealDetailDrawer;