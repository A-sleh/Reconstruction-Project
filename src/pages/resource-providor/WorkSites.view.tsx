import { motion } from "framer-motion";
import { Building2, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteCard } from "@/features/resource-providor/work-sites/components/SiteCard";
import { SiteModal } from "@/features/resource-providor/work-sites/components/SiteModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialoge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkSite } from "@/data/resource-providor/mockData";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";

const Index = () => {
  const sites = useAppStore((s) => s.sites);
  const resources = useAppStore((s) => s.resources);
  const addSite = useAppStore((s) => s.addSite);
  const updateSite = useAppStore((s) => s.updateSite);
  const deleteSite = useAppStore((s) => s.deleteSite);

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WorkSite | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WorkSite | null>(null);

  const filtered = useMemo(
    () =>
      sites.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.location.toLowerCase().includes(query.toLowerCase()) ||
          s.manager.toLowerCase().includes(query.toLowerCase())
      ),
    [sites, query]
  );

  const stats = [
    { label: "Active Sites", value: sites.filter((s) => s.status === "active").length },
    { label: "Total Sites", value: sites.length },
    { label: "Tracked Resources", value: resources.length },
  ];

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (s: WorkSite) => { setEditing(s); setModalOpen(true); };
  const handleDelete = (s: WorkSite) => setPendingDelete(s);
  const confirmDelete = () => {
    if (pendingDelete) {
      deleteSite(pendingDelete.id);
      toast.success(`"${pendingDelete.name}" deleted`);
      setPendingDelete(null);
    }
  };
  const handleSave = (data: Omit<WorkSite, "id">) => {
    if (editing) {
      updateSite(editing.id, data);
      toast.success("Work site updated");
    } else {
      addSite(data);
      toast.success("Work site created");
    }
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-muted/40">
        <div className="container py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Live Operations Dashboard
            </div>
            <h1 className="mt-4 text-4xl lg:text-5xl font-bold leading-tight">
              Manage every <span className="text-accent">work site</span> from a single command center.
            </h1>
            <p className="mt-3 text-base lg:text-lg text-muted-foreground">
              Track sites, allocate resources and keep crews moving — built for modern construction operations.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-2xl">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Work Sites</h2>
            <span className="text-sm text-muted-foreground">({filtered.length})</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sites, locations, managers..."
                className="pl-9"
              />
            </div>
            <Button variant="accent" onClick={openAdd} className="shrink-0">
              <Plus className="h-4 w-4" /> New Site
            </Button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((site, i) => (
            <SiteCard
              key={site.id}
              site={site}
              index={i}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No sites match your search.</div>
        )}
      </section>

      <SiteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this work site?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold text-foreground">{pendingDelete?.name}</span> and all of its associated resources. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete site
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
