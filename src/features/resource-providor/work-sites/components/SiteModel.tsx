import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { SiteStatus, WorkSite } from "@/data/resource-providor/mockData";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<WorkSite, "id">) => void;
  initial?: WorkSite | null;
}

const statuses: SiteStatus[] = ["active", "on-hold", "completed"];

export function SiteModal({ open, onClose, onSave, initial }: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [manager, setManager] = useState("");
  const [status, setStatus] = useState<SiteStatus>("active");
  const [startDate, setStartDate] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setLocation(initial?.location ?? "");
      setManager(initial?.manager ?? "");
      setStatus(initial?.status ?? "active");
      setStartDate(initial?.startDate ?? new Date().toISOString().slice(0, 10));
      setProgress(initial?.progress ?? 0);
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      location: location.trim(),
      manager: manager.trim(),
      status,
      startDate,
      progress: Math.max(0, Math.min(100, progress)),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-elegant"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="text-xl font-semibold">{initial ? "Edit Work Site" : "Add Work Site"}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Set the core details for this construction project.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Horizon Tower" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-location">Location</Label>
                  <Input id="site-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-manager">Manager</Label>
                  <Input id="site-manager" value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Full name" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as SiteStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-date">Start Date</Label>
                  <Input id="site-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-progress">Progress (%)</Label>
                  <Input id="site-progress" type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="accent">
                  {initial ? "Save Changes" : "Create Site"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
