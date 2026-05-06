import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Boxes, DollarSign, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ResourceModal } from "@/features/resource-providor/site-resources/components/ResourceModel";
import { StatusBadge } from "@/features/resource-providor/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Resource } from "@/data/resource-providor/mockData";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";

const SiteResources = () => {
  const { siteId = "" } = useParams();
  const navigate = useNavigate();
  const site = useAppStore((s) => s.sites.find((x) => x.id === siteId));
  const allResources = useAppStore((s) => s.resources);
  const resources = useMemo(() => allResources.filter((r) => r.siteId === siteId), [allResources, siteId]);
  const addResource = useAppStore((s) => s.addResource);
  const updateResource = useAppStore((s) => s.updateResource);
  const deleteResource = useAppStore((s) => s.deleteResource);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      resources.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.type.toLowerCase().includes(query.toLowerCase())
      ),
    [resources, query]
  );

  const totalValue = resources.reduce((sum, r) => sum + r.quantity * r.unitPrice, 0);

  if (!site) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Site not found.</p>
          <Button onClick={() => navigate("/")} className="mt-4">Back to sites</Button>
        </div>
      </div>
    );
  }

  const handleSave = (data: Omit<Resource, "id" | "siteId">) => {
    if (editing) {
      updateResource(editing.id, { ...data, siteId });
      toast.success("Resource updated");
    } else {
      addResource({ ...data, siteId });
      toast.success("Resource added");
    }
    setEditing(null);
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (r: Resource) => { setEditing(r); setModalOpen(true); };
  const handleDelete = (r: Resource) => {
    if (confirm(`Delete "${r.name}"?`)) {
      deleteResource(r.id);
      toast.success("Resource deleted");
    }
  };

  const stats = [
    { label: "Total Resources", value: resources.length, icon: Package },
    { label: "Total Quantity", value: resources.reduce((s, r) => s + r.quantity, 0), icon: Boxes },
    { label: "Inventory Value", value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background">

      <section className="border-b border-border gradient-hero text-primary-foreground">
        <div className="container py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" /> All Work Sites
          </Link>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <StatusBadge status={site.status} />
                <span className="text-sm text-primary-foreground/70">
                  Manager · {site.manager}
                </span>
              </div>
              <h1 className="mt-2 text-3xl lg:text-4xl font-bold">{site.name}</h1>
              <p className="text-primary-foreground/80 mt-1">{site.location}</p>
            </motion.div>

            <Button variant="accent" size="lg" onClick={openAdd} className="self-start lg:self-auto">
              <Plus className="h-4 w-4" /> Add New Resource
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur p-4"
              >
                <s.icon className="h-4 w-4 text-accent-glow mb-2" />
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-[11px] uppercase tracking-wider text-primary-foreground/70 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h2 className="text-lg font-semibold">Resource Inventory</h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Resource</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-right font-medium px-5 py-3">Quantity</th>
                  <th className="text-right font-medium px-5 py-3">Unit Price</th>
                  <th className="text-right font-medium px-5 py-3">Total</th>
                  <th className="text-left font-medium px-5 py-3">Availability</th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((r) => (
                    <motion.tr
                      key={r.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-t border-border hover:bg-muted/30 transition-smooth"
                    >
                      <td className="px-5 py-4 font-medium text-foreground">{r.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{r.type}</td>
                      <td className="px-5 py-4 text-right tabular-nums">{r.quantity.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right tabular-nums">${r.unitPrice.toFixed(2)}</td>
                      <td className="px-5 py-4 text-right tabular-nums font-semibold text-primary">
                        ${(r.quantity * r.unitPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={r.availability} /></td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(r)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(r)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No resources yet. Click "Add New Resource" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ResourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
};

export default SiteResources;