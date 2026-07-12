import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Plus,
  Pencil,
  TrendingUp,
  Wallet,
  HardHat,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  properties,
  projects,
  formatCurrency,
  type Property,
} from "@/data/investor/mock";
import { paths } from "@/config/paths";

const statusColor: Record<Property["status"], string> = {
  Operational: "bg-emerald/10 text-emerald border-emerald/20",
  Leased: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Under Construction": "bg-gold/10 text-gold border-gold/30",
  Vacant: "bg-muted text-muted-foreground border-border",
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  accent?: boolean;
}) {
  return (
    <Card className="shadow-card border-border/60 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-semibold mt-2 text-foreground">
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent ? "bg-gradient-emerald text-white" : "bg-primary text-white"}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyCard({ p }: { p: Property }) {
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
              Valuation
            </p>
            <p className="font-semibold text-foreground">
              {formatCurrency(p.value)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Area
            </p>
            <p className="font-semibold text-foreground">
              {p.area.toLocaleString()} m²
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Link to={paths.app.investor.landBuildingDetails.getHref(p.id)}>View</Link>
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const Index = () => {
  const totalValue = properties.reduce((s, p) => s + p.value, 0);
  const buildings = properties.filter((p) => p.type === "building").length;
  const lands = properties.filter((p) => p.type === "land").length;
  const activeProjects = projects.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Investor Dashboard
          </p>
          <h1 className="text-3xl font-semibold mt-1 text-foreground">
            Portfolio Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage owned assets, oversee projects, and track financial
            performance.
          </p>
        </div>
        <Button className="bg-gradient-emerald hover:opacity-95 text-white shadow-elegant gap-2">
          <Plus className="h-4 w-4" /> Add New Property
        </Button>
      </div>

       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Portfolio Value"
          value={formatCurrency(totalValue)}
          sub="+4.2% YoY"
          icon={Wallet}
          accent
        />
        <StatCard
          label="Buildings"
          value={String(buildings)}
          sub="Operational & dev."
          icon={Building2}
        />
        <StatCard
          label="Land Parcels"
          value={String(lands)}
          sub="Across 4 regions"
          icon={Layers}
        />
        <StatCard
          label="Active Projects"
          value={String(activeProjects)}
          sub="On-site construction"
          icon={HardHat}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="bg-white">
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="building">Buildings</TabsTrigger>
            <TabsTrigger value="land">Lands</TabsTrigger>
          </TabsList>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald" /> Portfolio up{" "}
            <span className="text-emerald font-medium">+4.2%</span> this quarter
          </div>
        </div>
        <TabsContent value="all" className="mt-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="building" className="mt-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties
              .filter((p) => p.type === "building")
              .map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="land" className="mt-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties
              .filter((p) => p.type === "land")
              .map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
          </div>
        </TabsContent>
      </Tabs> 
    </div>
  );
};

export default Index;
