import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, HardHat, Users, Boxes, Camera, Wallet, CheckCircle2, Clock, Circle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { projects, properties, formatCurrency } from "@/data/investor/mock";
import { paths } from "@/config/paths";

const stageIcon = { Done: CheckCircle2, Active: Clock, Pending: Circle } as const;
const stageColor = { Done: "text-emerald", Active: "text-gold", Pending: "text-muted-foreground" } as const;

export default function ProjectWorksite() {
  const { id } = useParams();
  const goBack = useNavigate()
  const project = projects.find((p) => p.id === id);
  if (!project) return <div className="p-8">Project not found.</div>;
  const property = properties.find((p) => p.id === project.propertyId);

  const [staff, setStaff] = useState(project.staff);
  const togglePerm = (sid: string, key: "read" | "write" | "manage") => {
    setStaff((cur) => cur.map((s) => s.id === sid ? { ...s, permissions: { ...s.permissions, [key]: !s.permissions[key] } } : s));
  };

  const remaining = project.budget - project.spent;
  const burn = Math.round((project.spent / project.budget) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><button onClick={() => goBack(-1)}><ArrowLeft className="h-4 w-4" /></button></Button>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Worksite — {property?.name}</p>
          <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
        </div>
        <Badge className="bg-gold/15 text-gold border-gold/30" variant="outline">In Progress</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card"><CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Overall Progress</p>
          <p className="text-2xl font-semibold mt-2">{project.progress}%</p>
          <Progress value={project.progress} className="h-2 mt-3" />
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Budget</p>
          <p className="text-2xl font-semibold mt-2">{formatCurrency(project.budget)}</p>
          <p className="text-xs text-muted-foreground mt-1">Allocated total</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Spent</p>
          <p className="text-2xl font-semibold mt-2 text-emerald">{formatCurrency(project.spent)}</p>
          <p className="text-xs text-muted-foreground mt-1">{burn}% of budget</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Remaining</p>
          <p className="text-2xl font-semibold mt-2">{formatCurrency(remaining)}</p>
          <p className="text-xs text-muted-foreground mt-1">Until {project.endDate}</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="stages" className="w-full">
        <TabsList className="bg-secondary flex-wrap h-auto">
          <TabsTrigger value="stages" className="gap-1.5"><HardHat className="h-3.5 w-3.5" />Workshops</TabsTrigger>
          <TabsTrigger value="staff" className="gap-1.5"><Users className="h-3.5 w-3.5" />Engineering & Staff</TabsTrigger>
          <TabsTrigger value="resources" className="gap-1.5"><Boxes className="h-3.5 w-3.5" />Resources</TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5"><Camera className="h-3.5 w-3.5" />Reports</TabsTrigger>
          <TabsTrigger value="finance" className="gap-1.5"><Wallet className="h-3.5 w-3.5" />Financial Hub</TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="mt-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.stages.map((s) => {
              const Icon = stageIcon[s.status];
              return (
                <Card key={s.id} className="shadow-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Workshop</p>
                        <h3 className="font-semibold text-foreground mt-1">{s.name}</h3>
                      </div>
                      <Icon className={`h-5 w-5 ${stageColor[s.status]}`} />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <Badge variant="outline" className={`${stageColor[s.status]} border-current/30`}>{s.status}</Badge>
                        <span className="font-medium">{s.progress}%</span>
                      </div>
                      <Progress value={s.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-5">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Access Control & Permissions</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Engineer</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Workshop</TableHead>
                    <TableHead className="text-center">Read</TableHead>
                    <TableHead className="text-center">Write</TableHead>
                    <TableHead className="text-center">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{s.role} · {s.stage}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{s.role}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{s.stage}</TableCell>
                      <TableCell className="text-center"><Switch checked={s.permissions.read} onCheckedChange={() => togglePerm(s.id, "read")} /></TableCell>
                      <TableCell className="text-center"><Switch checked={s.permissions.write} onCheckedChange={() => togglePerm(s.id, "write")} /></TableCell>
                      <TableCell className="text-center"><Switch checked={s.permissions.manage} onCheckedChange={() => togglePerm(s.id, "manage")} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-5">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Materials & Outsourced Services</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.resources.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{r.category}</TableCell>
                      <TableCell>{r.quantity.toLocaleString()} {r.unit}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatCurrency(r.cost)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          r.status === "In Stock" ? "border-emerald/30 text-emerald" :
                          r.status === "Ordered" ? "border-blue-500/30 text-blue-600" :
                          "border-destructive/30 text-destructive"
                        }>{r.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.reports.map((r) => (
              <Card key={r.id} className="shadow-card overflow-hidden group">
                <div className="relative h-40 overflow-hidden">
                  <img src={r.image} alt={r.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-card/90 text-[11px] font-medium flex items-center gap-1"><ImageIcon className="h-3 w-3" />Site Photo</div>
                </div>
                <CardContent className="p-4">
                  <p className="font-medium text-foreground">{r.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>{r.author}</span><span>{r.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-5 space-y-5">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="shadow-card md:col-span-2">
              <CardHeader><CardTitle>Budget vs Actual</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-muted-foreground">Spent</span><span className="font-medium">{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span></div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-emerald" style={{ width: `${burn}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-secondary/60"><p className="text-[11px] uppercase text-muted-foreground">Materials</p><p className="font-semibold mt-1">{formatCurrency(1840000)}</p></div>
                  <div className="p-3 rounded-lg bg-secondary/60"><p className="text-[11px] uppercase text-muted-foreground">Labor</p><p className="font-semibold mt-1">{formatCurrency(960000)}</p></div>
                  <div className="p-3 rounded-lg bg-secondary/60"><p className="text-[11px] uppercase text-muted-foreground">Equipment</p><p className="font-semibold mt-1">{formatCurrency(720000)}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card bg-gradient-primary text-primary-foreground">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wider opacity-70">Cash Position</p>
                <p className="text-3xl font-semibold mt-2">{formatCurrency(remaining)}</p>
                <p className="text-xs opacity-70 mt-1">Available capital</p>
                <Button className="mt-4 w-full bg-emerald hover:bg-emerald/90 text-white">Release Tranche</Button>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-card">
            <CardHeader><CardTitle>Ledger</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Date</TableHead><TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {project.ledger.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-muted-foreground text-sm">{l.date}</TableCell>
                      <TableCell className="font-medium">{l.description}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{l.category}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(l.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          l.status === "Paid" ? "border-emerald/30 text-emerald" :
                          l.status === "Pending" ? "border-gold/40 text-gold" :
                          "border-destructive/30 text-destructive"
                        }>{l.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}