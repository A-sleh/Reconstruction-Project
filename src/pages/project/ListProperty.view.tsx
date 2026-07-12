import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trees,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type AssetType = "land" | "building";

type LandForm = {
  location: string;
  area: string;
  borders: string;
  zoning: string;
  accessibility: string;
  address: string;
};

type BuildingForm = {
  city: string;
  street: string;
  address: string;
  zone_type: string;
  readiness_level: string;
  orientation: string;
  building_type: string;
  land_id: string;
};

type DealForm = {
  total_area: string;
  expected_price: string;
  terms: string;
};

type UploadedDoc = {
  id: string;
  name: string;
  size: number;
  type: string;
};

const steps = [
  { id: 1, title: "Details", subtitle: "Asset basics", icon: Landmark },
  { id: 2, title: "Verify Ownership", subtitle: "Upload documents", icon: ShieldCheck },
  { id: 3, title: "Pricing & Publish", subtitle: "Deal terms", icon: Sparkles },
];

const zoneTypes = [
  "Residential",
  "Commercial",
  "Mixed Use",
  "Industrial",
  "Hospitality",
  "Office",
];
const readinessLevels = ["Shell & Core", "Semi-Finished", "Fully Finished", "Furnished"];
const orientations = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const buildingTypes = ["Apartment Tower", "Villa", "Office Block", "Retail Plaza", "Warehouse", "Mixed-use"];
const zoningOptions = ["Residential", "Commercial", "Agricultural", "Industrial", "Mixed Use"];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ListProperty() {
  const [step, setStep] = useState(1);
  const [assetType, setAssetType] = useState<AssetType>("land");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 30.0444, lng: 31.2357 });
  const [land, setLand] = useState<LandForm>({
    location: "",
    area: "",
    borders: "",
    zoning: "",
    accessibility: "",
    address: "",
  });
  const [building, setBuilding] = useState<BuildingForm>({
    city: "",
    street: "",
    address: "",
    zone_type: "",
    readiness_level: "",
    orientation: "",
    building_type: "",
    land_id: "",
  });
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [dragging, setDragging] = useState(false);
  const [deal, setDeal] = useState<DealForm>({ total_area: "", expected_price: "", terms: "" });
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const progress = useMemo(() => ((step - 1) / (steps.length - 1)) * 100, [step]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const next: UploadedDoc[] = Array.from(files).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setDocs((d) => [...d, ...next]);
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Map relative coords to lat/lng around a center
    const lng = 31.2357 + (x - 0.5) * 0.4;
    const lat = 30.0444 - (y - 0.5) * 0.3;
    setCoords({ lat: +lat.toFixed(5), lng: +lng.toFixed(5) });
  };

  const next = () => setStep((s) => Math.min(steps.length, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => setSuccess(true);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Portfolio
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            List a Property for Sale
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Submit a Land or Building to the Atlas marketplace. Your listing stays as a draft until our review team verifies your ownership documents.
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-1.5 border-emerald/30 bg-emerald-soft text-emerald">
          <ShieldCheck className="h-3.5 w-3.5" />
          Investor Workspace
        </Badge>
      </div>

      {/* Stepper */}
      <div className="mb-8 rounded-xl border bg-card p-5 shadow-card">
        <div className="relative grid grid-cols-3 gap-4">
          <div className="absolute left-5 right-5 top-5 h-0.5 bg-border" />
          <div
            className="absolute left-5 top-5 h-0.5 bg-emerald transition-all duration-500"
            style={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
          />
          {steps.map((s) => {
            const done = step > s.id;
            const active = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div
                  className={cn(
                    "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-all",
                    done && "border-emerald bg-emerald text-white",
                    active && "border-emerald bg-emerald-soft text-emerald shadow-elegant",
                    !done && !active && "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <div className="mt-3 md:ml-1">
                  <div className={cn("text-xs uppercase tracking-wider", active ? "text-emerald" : "text-muted-foreground")}>
                    Step {s.id}
                  </div>
                  <div className={cn("text-sm font-semibold", active ? "text-foreground" : "text-foreground/80")}>
                    {s.title}
                  </div>
                  <div className="hidden text-xs text-muted-foreground md:block">{s.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <Card className="shadow-card">
        <CardContent className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold">Property Type & Basic Info</h2>
                <p className="text-sm text-muted-foreground">Choose what you're listing — the form adapts to the asset.</p>
              </div>

              {/* Type toggle */}
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    { v: "land", title: "Land Parcel", desc: "Plots, lots & undeveloped land", icon: Trees },
                    { v: "building", title: "Building", desc: "Residential, commercial or mixed-use", icon: Building2 },
                  ] as { v: AssetType; title: string; desc: string; icon: typeof Trees }[]
                ).map(({ v, title, desc, icon: Icon }) => {
                  const selected = assetType === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAssetType(v)}
                      className={cn(
                        "group flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all",
                        selected
                          ? "border-emerald bg-emerald-soft/40 shadow-elegant"
                          : "border-border bg-background hover:border-emerald/40",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-lg",
                          selected ? "bg-emerald text-white" : "bg-muted text-slate",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">{title}</span>
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border-2",
                              selected ? "border-emerald bg-emerald text-white" : "border-border",
                            )}
                          >
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic fields */}
              {assetType === "land" ? (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Location (City / Region)">
                    <Input value={land.location} onChange={(e) => setLand({ ...land, location: e.target.value })} placeholder="e.g. New Cairo" />
                  </Field>
                  <Field label="Area (sqm)">
                    <Input type="number" value={land.area} onChange={(e) => setLand({ ...land, area: e.target.value })} placeholder="1200" />
                  </Field>
                  <Field label="Border / Boundaries">
                    <Input value={land.borders} onChange={(e) => setLand({ ...land, borders: e.target.value })} placeholder="N: Road · S: Plot 14 · E: River · W: Park" />
                  </Field>
                  <Field label="Zoning">
                    <Select value={land.zoning} onValueChange={(v) => setLand({ ...land, zoning: v })}>
                      <SelectTrigger><SelectValue placeholder="Select zoning" /></SelectTrigger>
                      <SelectContent>
                        {zoningOptions.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Accessibility">
                    <Input value={land.accessibility} onChange={(e) => setLand({ ...land, accessibility: e.target.value })} placeholder="Paved road, near highway exit" />
                  </Field>
                  <Field label="Full Address" className="md:col-span-2">
                    <Textarea rows={2} value={land.address} onChange={(e) => setLand({ ...land, address: e.target.value })} placeholder="Plot, district, governorate" />
                  </Field>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="City">
                    <Input value={building.city} onChange={(e) => setBuilding({ ...building, city: e.target.value })} placeholder="Cairo" />
                  </Field>
                  <Field label="Street Name">
                    <Input value={building.street} onChange={(e) => setBuilding({ ...building, street: e.target.value })} placeholder="El Tahrir St." />
                  </Field>
                  <Field label="Full Address" className="md:col-span-2">
                    <Textarea rows={2} value={building.address} onChange={(e) => setBuilding({ ...building, address: e.target.value })} placeholder="Building no., floor, district" />
                  </Field>
                  <Field label="Zone Type">
                    <Select value={building.zone_type} onValueChange={(v) => setBuilding({ ...building, zone_type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select zone type" /></SelectTrigger>
                      <SelectContent>
                        {zoneTypes.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Readiness Level">
                    <Select value={building.readiness_level} onValueChange={(v) => setBuilding({ ...building, readiness_level: v })}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        {readinessLevels.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Orientation">
                    <Select value={building.orientation} onValueChange={(v) => setBuilding({ ...building, orientation: v })}>
                      <SelectTrigger><SelectValue placeholder="Facing" /></SelectTrigger>
                      <SelectContent>
                        {orientations.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Building Type">
                    <Select value={building.building_type} onValueChange={(v) => setBuilding({ ...building, building_type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {buildingTypes.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Land ID Reference (optional)" className="md:col-span-2">
                    <Input value={building.land_id} onChange={(e) => setBuilding({ ...building, land_id: e.target.value })} placeholder="LAND-00231" />
                  </Field>
                </div>
              )}

              {/* Map picker */}
              <div>
                <Label className="mb-2 inline-flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-emerald" /> Pin location on map
                </Label>
                <div
                  onClick={handleMapClick}
                  className="relative h-64 cursor-crosshair overflow-hidden rounded-xl border bg-[linear-gradient(135deg,hsl(210_40%_95%),hsl(158_40%_92%))]"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(215 25% 80% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(215 25% 80% / 0.3) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                >
                  <div className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
                    Click anywhere to drop a pin
                  </div>
                  <div
                    className="absolute -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${((coords.lng - 31.2357) / 0.4 + 0.5) * 100}%`,
                      top: `${((30.0444 - coords.lat) / 0.3 + 0.5) * 100}%`,
                    }}
                  >
                    <div className="relative">
                      <MapPin className="h-7 w-7 fill-emerald text-white drop-shadow-lg" strokeWidth={1.5} />
                      <span className="absolute -bottom-0.5 left-1/2 h-2 w-2 -translate-x-1/2 animate-ping rounded-full bg-emerald/70" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Latitude">
                    <Input value={coords.lat} onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) || 0 })} />
                  </Field>
                  <Field label="Longitude">
                    <Input value={coords.lng} onChange={(e) => setCoords({ ...coords, lng: parseFloat(e.target.value) || 0 })} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Ownership Verification</h2>
                <p className="text-sm text-muted-foreground">Upload Title Deeds, Commercial Registrations, or Ownership Certificates.</p>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div>
                  <p className="font-medium">Pending admin review</p>
                  <p className="text-amber-800/80">
                    Your listing will be saved as a <span className="font-mono font-medium">draft</span> with{" "}
                    <span className="font-mono">is_validated = false</span> until an admin reviews and approves your ownership documents.
                  </p>
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all",
                  dragging ? "border-emerald bg-emerald-soft" : "border-border bg-muted/40 hover:border-emerald/50 hover:bg-emerald-soft/30",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Drag & drop files here, or click to browse</p>
                <p className="text-xs text-muted-foreground">PDF, PNG, JPG · up to 20MB each</p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {docs.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Uploaded documents ({docs.length})
                  </Label>
                  <div className="divide-y rounded-lg border bg-background">
                    {docs.map((d) => {
                      const isImg = d.type.startsWith("image/");
                      return (
                        <div key={d.id} className="flex items-center gap-3 p-3">
                          <div className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-md",
                            isImg ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600",
                          )}>
                            {isImg ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{formatBytes(d.size)}</p>
                          </div>
                          <Badge variant="outline" className="border-emerald/30 bg-emerald-soft text-emerald">
                            <Check className="mr-1 h-3 w-3" /> Ready
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDocs((arr) => arr.filter((x) => x.id !== d.id))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold">Deal & Pricing</h2>
                <p className="text-sm text-muted-foreground">Set your asking price and the terms of the deal.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Total Deal Area (sqm)">
                  <Input type="number" value={deal.total_area} onChange={(e) => setDeal({ ...deal, total_area: e.target.value })} placeholder="1200" />
                </Field>
                <Field label="Expected Price / Value (USD)">
                  <Input type="number" value={deal.expected_price} onChange={(e) => setDeal({ ...deal, expected_price: e.target.value })} placeholder="450,000" />
                </Field>
                <Field label="Additional Terms" className="md:col-span-2">
                  <Textarea rows={4} value={deal.terms} onChange={(e) => setDeal({ ...deal, terms: e.target.value })} placeholder="Payment plan, conditions, exclusions, hand-over date…" />
                </Field>
              </div>

              {/* Summary */}
              <div className="rounded-xl border bg-gradient-to-br from-muted/40 to-emerald-soft/30 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate">Submission summary</h3>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <Row label="Asset Type" value={assetType === "land" ? "Land" : "Building"} />
                  <Row label="Coordinates" value={`${coords.lat}, ${coords.lng}`} />
                  <Row label="Location" value={assetType === "land" ? land.location || "—" : building.city || "—"} />
                  <Row label="Documents" value={`${docs.length} file(s)`} />
                  <Row label="Expected Price" value={deal.expected_price ? `$${Number(deal.expected_price).toLocaleString()}` : "—"} />
                  <Row label="Status" value="Draft · Pending review" />
                </dl>
              </div>
            </div>
          )}

          {/* Footer nav */}
          <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center">
            <Button variant="outline" onClick={prev} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Step {step} of {steps.length}
            </div>
            {step < steps.length ? (
              <Button onClick={next} className="bg-gradient-emerald text-white hover:opacity-95">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} className="bg-gradient-emerald text-white hover:opacity-95">
                <ShieldCheck className="h-4 w-4" /> Submit for Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success modal */}
      {/* <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-soft">
              <CheckCircle2 className="h-7 w-7 text-emerald" />
            </div>
            <DialogTitle className="text-center text-xl">Listing submitted for review</DialogTitle>
            <DialogDescription className="text-center">
              Your {assetType} listing is saved as a draft with{" "}
              <span className="font-mono">is_validated = false</span>. Our admin team will verify your ownership documents within 24–48 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Reference ID</span><span className="font-mono text-foreground">DRAFT-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span></div>
            <div className="mt-1 flex justify-between"><span>Status</span><span className="text-amber-600">Pending validation</span></div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setSuccess(false)}>Close</Button>
            <Button asChild className="bg-gradient-emerald text-white hover:opacity-95">
              <Link to="/">Back to Portfolio</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-dashed border-border/60 pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}