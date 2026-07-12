import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Map as MapIcon,
  Building2,
  Pencil,
  Plus,
  HardHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { properties, projects, formatCurrency } from "@/data/investor/mock";
import { paths } from "@/config/paths";

export default function PropertyDetail() {
  const { id } = useParams();
  const goBack = useNavigate();
  const p = properties.find((x) => x.id === id);
  if (!p)
    return (
      <div className="p-8">
        Property not found.{" "}
        <Link to="/" className="text-emerald underline">
          Back
        </Link>
      </div>
    );

  const linkedProjects = projects.filter((pr) => pr.propertyId === p.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <button onClick={() => goBack(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground capitalize">
              {p.type}
            </p>
            <h1 className="text-2xl font-semibold text-foreground">{p.name}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {p.location}
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Pencil className="h-4 w-4" /> Edit Property
        </Button>
      </div>

      <div className="relative h-56 md:h-64 rounded-xl overflow-hidden shadow-card">
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex flex-wrap gap-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">
              Valuation
            </p>
            <p className="text-xl font-semibold">{formatCurrency(p.value)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">
              Total Area
            </p>
            <p className="text-xl font-semibold">
              {p.area.toLocaleString()} m²
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">
              Status
            </p>
            <p className="text-xl font-semibold">{p.status}</p>
          </div>
        </div>
      </div>

      {p.type === "building" ? (
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald" /> Floor Map
            </CardTitle>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Floor
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {p.floors?.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-secondary/40 transition-colors"
                >
                  <div className="h-12 w-12 rounded-md bg-gradient-primary text-primary-foreground flex flex-col items-center justify-center text-xs font-semibold">
                    <span className="text-[10px] opacity-70">FL</span>
                    <span className="text-base leading-none">{f.level}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-[11px] uppercase text-muted-foreground">
                        Area
                      </p>
                      <p className="font-medium">{f.area} m²</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-muted-foreground">
                        Units
                      </p>
                      <p className="font-medium">{f.units}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] uppercase text-muted-foreground">
                        Occupancy
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={f.occupancy} className="h-2" />
                        <span className="text-xs font-medium w-10 text-right">
                          {f.occupancy}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Land Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Area
                  </p>
                  <p className="font-semibold">{p.area.toLocaleString()} m²</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Zoning
                  </p>
                  <p className="font-semibold">{p.zoning}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Valuation
                  </p>
                  <p className="font-semibold">{formatCurrency(p.value)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className="border-emerald/30 text-emerald"
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  Documents
                </p>
                <div className="space-y-2">
                  {p.documents?.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between p-2.5 rounded-md border border-border hover:bg-secondary/40"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-emerald" />
                        {d.name}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {d.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="shadow-card overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-emerald" /> Interactive Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-56 rounded-md overflow-hidden bg-gradient-to-br from-secondary to-muted border border-border">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 40%, hsl(var(--emerald)/0.25), transparent 50%), linear-gradient(45deg, hsl(var(--border)) 1px, transparent 1px), linear-gradient(-45deg, hsl(var(--border)) 1px, transparent 1px)",
                      backgroundSize: "auto, 24px 24px, 24px 24px",
                    }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full bg-emerald shadow-elegant ring-4 ring-emerald/30 animate-pulse" />
                    <span className="text-xs mt-2 px-2 py-0.5 rounded bg-card border border-border shadow-card">
                      {p.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-emerald" /> Active
                  Construction
                </CardTitle>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-3.5 w-3.5" /> New Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {linkedProjects.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No active projects on this land.
                  </p>
                )}
                {linkedProjects.map((pr) => (
                  <Link
                    key={pr.id}
                    to={paths.app.projects.projectWorkSite.getHref(pr.id)}
                    className="block p-3 rounded-lg border border-border hover:border-emerald/40 hover:bg-emerald-soft/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{pr.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {pr.progress}%
                      </span>
                    </div>
                    <Progress value={pr.progress} className="h-1.5 mt-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Budget {formatCurrency(pr.budget)}</span>
                      <span>Spent {formatCurrency(pr.spent)}</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
