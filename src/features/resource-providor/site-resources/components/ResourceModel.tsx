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
import { Resource, ResourceAvailability, ResourceType } from "@/data/resource-providor/mockData";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Resource, "id" | "siteId">) => void;
  initial?: Resource | null;
}

const types: ResourceType[] = ["Material", "Equipment", "Tool", "Vehicle", "Labor"];
const availabilities: ResourceAvailability[] = ["in-stock", "low-stock", "out-of-stock"];

export function ResourceModal({ open, onClose, onSave, initial }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ResourceType>("Material");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [availability, setAvailability] = useState<ResourceAvailability>("in-stock");

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setType(initial?.type ?? "Material");
      setQuantity(initial?.quantity ?? 0);
      setUnitPrice(initial?.unitPrice ?? 0);
      setAvailability(initial?.availability ?? "in-stock");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), type, quantity, unitPrice, availability });
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
                <h2 className="text-xl font-semibold">{initial ? "Edit Resource" : "Add New Resource"}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Track materials, equipment and labor for this site.
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
                <Label htmlFor="name">Resource Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Steel Rebar #5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as ResourceType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select value={availability} onValueChange={(v) => setAvailability(v as ResourceAvailability)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availabilities.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity</Label>
                  <Input
                    id="qty"
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Unit Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="accent">
                  {initial ? "Save Changes" : "Add Resource"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
