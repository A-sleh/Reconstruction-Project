import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  IdCard,
  ShieldCheck,
  Factory,
  Mountain,
  Warehouse,
  Wrench,
  Building2,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Package,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { providerProfile, WorksiteType } from "@/data/providerData";
import { RequestResourceModal } from "@/components/RequestResourceModal";

const worksiteIcon: Record<WorksiteType, React.ComponentType<{ className?: string }>> = {
  Quarry: Mountain,
  Factory: Factory,
  Warehouse: Warehouse,
  Workshop: Wrench,
  Office: Building2,
};

export default function Profile() {
  const p = providerProfile;
  const [open, setOpen] = useState(false);

  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
  const money = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border bg-card shadow-sm"
        >
          <div className="h-32 gradient-hero" />
          <div className="px-6 sm:px-8 pb-6 -mt-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                <Avatar className="h-28 w-28 ring-4 ring-card shadow-elegant">
                  <AvatarImage src={p.photo} alt={p.fullName} />
                  <AvatarFallback>{p.fullName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="space-y-2 pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold">{p.fullName}</h1>
                    {p.verified && (
                      <Badge className="gap-1 bg-success/15 text-success border border-success/30 hover:bg-success/20">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified Provider
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{p.role}</p>
                  <div className="inline-flex">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent border border-accent/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                      {p.speciality}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button variant="hero" onClick={() => setOpen(true)}>
                  <Send className="h-4 w-4" /> Request Resource
                </Button>
              </div>
            </div>

            {/* Contact badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <ContactChip icon={Mail} label={p.email} />
              <ContactChip icon={Phone} label={p.phone} />
              <ContactChip icon={IdCard} label={`CR: ${p.commercialRegisterId}`} />
              <ContactChip icon={IdCard} label={`Syndicate: ${p.syndicateId}`} />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={DollarSign} label="Total Sales Revenue" value={money(p.stats.totalRevenue)} accent="primary" />
          <StatCard icon={Package} label="Active Orders" value={String(p.stats.activeOrders)} accent="accent" />
          <StatCard icon={CheckCircle2} label="Fulfilled Requests" value={String(p.stats.fulfilledRequests)} accent="success" />
        </section>

        {/* Chart + Inventory */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Monthly sales & deliveries</p>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={p.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="deliveries" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resource Inventory</CardTitle>
              <p className="text-sm text-muted-foreground">Main supplied items</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {p.resources.map((r) => {
                const Trend = r.trend === "up" ? TrendingUp : r.trend === "down" ? TrendingDown : Minus;
                const trendColor =
                  r.trend === "up" ? "text-success" : r.trend === "down" ? "text-destructive" : "text-muted-foreground";
                return (
                  <div key={r.name} className="flex items-center justify-between rounded-lg border bg-background/50 p-3">
                    <div>
                      <p className="font-medium text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{fmt(r.monthlyVolume)} {r.unit} / mo</p>
                    </div>
                    <Trend className={`h-4 w-4 ${trendColor}`} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        {/* Worksites */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold">Work Sites</h2>
              <p className="text-sm text-muted-foreground">Locations and operational facilities</p>
            </div>
            <Badge variant="outline">{p.worksites.length} sites</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.worksites.map((w, i) => {
              const Icon = worksiteIcon[w.type];
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full transition-smooth hover:shadow-elegant hover:-translate-y-0.5">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{w.type}</Badge>
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">{w.companyName}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {w.city}, {w.region}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <a href={w.mapUrl} target="_blank" rel="noreferrer">
                          <MapPin className="h-3.5 w-3.5" /> View on Map
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <RequestResourceModal
        open={open}
        onClose={() => setOpen(false)}
        resources={p.resources}
        providerName={p.fullName}
      />
    </div>
  );
}

function ContactChip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      {label}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: "primary" | "accent" | "success";
}) {
  const styles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/15 text-success",
  }[accent];
  return (
    <Card className="transition-smooth hover:shadow-elegant">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
