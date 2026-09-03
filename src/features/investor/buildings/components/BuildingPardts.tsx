import { useCallback, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bath,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CookingPot,
  DoorOpen,
  GripVertical,
  Home,
  Landmark,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// ─── Types ──────────────────────────────────────────────────────────────────

export type EBuildingPartType =
  | "Floor"
  | "Room"
  | "Bathroom"
  | "Kitchen"
  | "Office"
  | "Hall"
  | "Roof";

interface BuildingPartNode {
  id: string;
  name: string;
  buildingPartType: EBuildingPartType;
  area: number;
  parentId: string | null;
}

interface BuildingPardtsProps {
  className?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PART_META: Record<
  EBuildingPartType,
  {
    icon: React.ReactNode;
    color: string;
    accentBg: string;
    accentBorder: string;
    softBg: string;
    label: string;
    gradient: string;
  }
> = {
  Floor: {
    icon: <Layers className="h-4 w-4" />,
    color: "text-blue-600",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
    softBg: "bg-blue-500/5",
    label: "Floor",
    gradient: "from-blue-500/8 to-transparent",
  },
  Room: {
    icon: <DoorOpen className="h-4 w-4" />,
    color: "text-emerald-600",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20",
    softBg: "bg-emerald-500/5",
    label: "Room",
    gradient: "from-emerald-500/8 to-transparent",
  },
  Bathroom: {
    icon: <Bath className="h-4 w-4" />,
    color: "text-cyan-600",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20",
    softBg: "bg-cyan-500/5",
    label: "Bathroom",
    gradient: "from-cyan-500/8 to-transparent",
  },
  Kitchen: {
    icon: <CookingPot className="h-4 w-4" />,
    color: "text-orange-600",
    accentBg: "bg-orange-500/10",
    accentBorder: "border-orange-500/20",
    softBg: "bg-orange-500/5",
    label: "Kitchen",
    gradient: "from-orange-500/8 to-transparent",
  },
  Office: {
    icon: <Briefcase className="h-4 w-4" />,
    color: "text-violet-600",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/20",
    softBg: "bg-violet-500/5",
    label: "Office",
    gradient: "from-violet-500/8 to-transparent",
  },
  Hall: {
    icon: <Landmark className="h-4 w-4" />,
    color: "text-amber-600",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20",
    softBg: "bg-amber-500/5",
    label: "Hall",
    gradient: "from-amber-500/8 to-transparent",
  },
  Roof: {
    icon: <Home className="h-4 w-4" />,
    color: "text-rose-600",
    accentBg: "bg-rose-500/10",
    accentBorder: "border-rose-500/20",
    softBg: "bg-rose-500/5",
    label: "Roof",
    gradient: "from-rose-500/8 to-transparent",
  },
};

const CHILD_TYPES_MAP: Record<EBuildingPartType, EBuildingPartType[]> = {
  Floor: ["Room", "Office", "Hall"],
  Roof: ["Room", "Hall"],
  Room: ["Bathroom", "Kitchen"],
  Office: ["Bathroom"],
  Hall: [],
  Bathroom: [],
  Kitchen: [],
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

const INITIAL_PARTS: BuildingPartNode[] = [
  {
    id: "f1",
    name: "Ground Floor",
    buildingPartType: "Floor",
    area: 160,
    parentId: null,
  },
  {
    id: "f2",
    name: "First Floor",
    buildingPartType: "Floor",
    area: 160,
    parentId: null,
  },
  {
    id: "f3",
    name: "Second Floor",
    buildingPartType: "Floor",
    area: 160,
    parentId: null,
  },
  {
    id: "r1",
    name: "Master Bedroom",
    buildingPartType: "Room",
    area: 35,
    parentId: "f1",
  },
  {
    id: "r2",
    name: "Living Room",
    buildingPartType: "Room",
    area: 45,
    parentId: "f1",
  },
  {
    id: "r3",
    name: "Bedroom 2",
    buildingPartType: "Room",
    area: 25,
    parentId: "f2",
  },
  {
    id: "r4",
    name: "Bedroom 3",
    buildingPartType: "Room",
    area: 25,
    parentId: "f2",
  },
  {
    id: "r5",
    name: "Open Office",
    buildingPartType: "Office",
    area: 40,
    parentId: "f3",
  },
  {
    id: "r6",
    name: "Meeting Hall",
    buildingPartType: "Hall",
    area: 50,
    parentId: "f3",
  },
  {
    id: "bath1",
    name: "En-suite Bath",
    buildingPartType: "Bathroom",
    area: 8,
    parentId: "r1",
  },
  {
    id: "bath2",
    name: "Guest Bath",
    buildingPartType: "Bathroom",
    area: 5,
    parentId: "r2",
  },
  {
    id: "k1",
    name: "Main Kitchen",
    buildingPartType: "Kitchen",
    area: 18,
    parentId: "r2",
  },
  {
    id: "bath3",
    name: "Shared Bath",
    buildingPartType: "Bathroom",
    area: 6,
    parentId: "r3",
  },
  {
    id: "k2",
    name: "Pantry Kitchen",
    buildingPartType: "Kitchen",
    area: 10,
    parentId: "r5",
  },
  {
    id: "roof1",
    name: "Roof Top Terrace",
    buildingPartType: "Roof",
    area: 80,
    parentId: null,
  },
  {
    id: "rh1",
    name: "Lounge Area",
    buildingPartType: "Hall",
    area: 30,
    parentId: "roof1",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getChildAreaSum(parts: BuildingPartNode[], parentId: string): number {
  return parts
    .filter((p) => p.parentId === parentId)
    .reduce((sum, p) => sum + p.area, 0);
}

function getChildren(
  parts: BuildingPartNode[],
  parentId: string | null,
): BuildingPartNode[] {
  return parts.filter((p) => p.parentId === parentId);
}

// ─── Area Ring ──────────────────────────────────────────────────────────────

function AreaRing({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const overflow = used > total;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10 shrink-0">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/80"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${overflow ? "text-destructive" : "text-primary"}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums text-foreground">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className={`text-xs font-bold tabular-nums ${overflow ? "text-destructive" : "text-foreground"}`}
        >
          {used} / {total} m²
        </span>
        {overflow && (
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-destructive">
            <AlertTriangle className="h-2.5 w-2.5" /> Exceeds capacity
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Draggable Part Chip ────────────────────────────────────────────────────

function DraggableChip({
  part,
  onDelete,
}: {
  part: BuildingPartNode;
  onDelete: (id: string) => void;
}) {
  const meta = PART_META[part.buildingPartType];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: part.id,
    data: { part },
  });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group/chip relative flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${meta.softBg} ${meta.accentBorder} ${isDragging ? "z-50 shadow-lg ring-2 ring-primary/20" : "hover:shadow-md hover:-translate-y-0.5"}`}
    >
      <button
        type="button"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing transition-colors hover:bg-white/60"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </button>

      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta.accentBg} ${meta.color}`}
      >
        {meta.icon}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <span className="truncate text-sm font-semibold text-foreground leading-tight">
          {part.name}
        </span>
        <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {part.area} m²
        </span>
      </div>

      <button
        type="button"
        onClick={() => onDelete(part.id)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground/0 group-hover/chip:text-muted-foreground/60 hover:!text-destructive hover:bg-destructive/10 transition-all"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </motion.div>
  );
}

// ─── Droppable Container Card ───────────────────────────────────────────────

function DroppableCard({
  part,
  parts,
  onAdd,
  onDelete,
  onAddChild,
}: {
  part: BuildingPartNode;
  parts: BuildingPartNode[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, allowedTypes: EBuildingPartType[]) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = PART_META[part.buildingPartType];
  const children = getChildren(parts, part.id);
  const childArea = getChildAreaSum(parts, part.id);
  const allowedChildTypes = CHILD_TYPES_MAP[part.buildingPartType] ?? [];
  const isContainer = allowedChildTypes.length > 0;

  const { isOver, setNodeRef } = useDroppable({
    id: part.id,
    data: { part },
  });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 bg-white ${
        isOver
          ? `border-primary/50 ring-4 ring-primary/10 shadow-elegant scale-[1.01]`
          : `border-border/60 shadow-card hover:shadow-elegant`
      }`}
    >
      {/* Gradient accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.gradient}`}
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        {isContainer && (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: collapsed ? -90 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
        )}

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
        >
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-foreground">
              {part.name}
            </h3>
            <Badge
              variant="outline"
              className={`border text-[10px] font-semibold ${meta.accentBorder} ${meta.accentBg} ${meta.color} px-2 py-0`}
            >
              {meta.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {children.length} sub-part{children.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-lg font-bold tabular-nums text-foreground">
            {part.area}
          </span>
          <span className="text-xs font-medium text-muted-foreground ml-0.5">
            m²
          </span>
        </div>
      </div>

      {/* Area ring + children count */}
      {isContainer && children.length > 0 && (
        <div className="px-5 pb-3">
          <AreaRing used={childArea} total={part.area} />
        </div>
      )}

      {/* Children grid */}
      {isContainer && children.length > 0 && !collapsed && (
        <div
          className={`border-t border-dashed mx-5 ${isOver ? "border-primary/30" : "border-border/40"}`}
        />
      )}

      {isContainer && !collapsed && (
        <div className="px-5 py-3">
          {children.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <AnimatePresence mode="popLayout">
                {children.map((child) => (
                  <DraggableChip
                    key={child.id}
                    part={child}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition-colors duration-200 ${
                isOver ? "border-primary/40 bg-primary/5" : "border-border/40"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${meta.accentBg} mb-2`}
              >
                <Plus className={`h-5 w-5 ${meta.color}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Drop parts here or add new ones
              </p>
            </div>
          )}

          {/* Add button */}
          <button
            type="button"
            onClick={() => onAddChild(part.id, allowedChildTypes)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {allowedChildTypes.join(" / ")}
          </button>
        </div>
      )}

      {/* Drop overlay */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-primary/5 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Add Part Modal ─────────────────────────────────────────────────────────

function AddPartModal({
  open,
  onOpenChange,
  allowedTypes,
  parentName,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowedTypes: EBuildingPartType[];
  parentName: string;
  onAdd: (part: Omit<BuildingPartNode, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState<EBuildingPartType>(
    allowedTypes[0] ?? "Room",
  );
  const [step, setStep] = useState<"form" | "confirm">("form");

  const meta = PART_META[type];

  const handleSubmit = () => {
    if (step === "form") {
      setStep("confirm");
      return;
    }
    if (!name.trim() || !area) return;
    onAdd({
      name: name.trim(),
      buildingPartType: type,
      area: Number(area),
      parentId: null,
    });
    setName("");
    setArea("");
    setStep("form");
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("form");
  };

  const handleClose = () => {
    setStep("form");
    setName("");
    setArea("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
        {/* Header gradient */}
        <div className={`bg-gradient-to-r ${meta.gradient} px-6 pt-6 pb-4`}>
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3 mb-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
              >
                {meta.icon}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {step === "form" ? "Add New Part" : "Confirm Addition"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {step === "form"
                    ? `Adding to ${parentName}`
                    : "Review before adding"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                {/* Type selector */}
                <div>
                  <label className="text-xs font-semibold text-foreground mb-2 block">
                    Part Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allowedTypes.map((t) => {
                      const m = PART_META[t];
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`group/type flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                            type === t
                              ? `${m.accentBg} ${m.accentBorder} ring-2 ring-offset-1 ring-primary/20`
                              : "border-border/40 hover:border-border hover:bg-muted/30"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${type === t ? m.accentBg : "bg-muted/60"} ${type === t ? m.color : "text-muted-foreground"} transition-colors`}
                          >
                            {m.icon}
                          </div>
                          <span
                            className={`text-sm font-semibold ${type === t ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-foreground mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Master Bedroom"
                    autoFocus
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="text-xs font-semibold text-foreground mb-2 block">
                    Area (m²)
                  </label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 25"
                    min={1}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 tabular-nums"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Confirmation summary */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`border text-[10px] font-semibold ${meta.accentBorder} ${meta.accentBg} ${meta.color} mt-0.5`}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-card border border-border/40 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
                        Area
                      </p>
                      <p className="text-lg font-bold tabular-nums text-foreground">
                        {area} m²
                      </p>
                    </div>
                    <div className="rounded-xl bg-card border border-border/40 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
                        Parent
                      </p>
                      <p className="text-sm font-semibold text-foreground truncate">
                        {parentName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/10 px-4 py-3">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs text-foreground">
                    This part will be added to the building structure. You can
                    drag it to a different section later.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0">
          {step === "confirm" && (
            <Button variant="outline" onClick={handleBack} className="mr-auto">
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !area || Number(area) <= 0}
            className="gap-1.5"
          >
            {step === "form" ? (
              <>
                Review <ChevronRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Confirm & Add
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Drag Overlay ───────────────────────────────────────────────────────────

function DragOverlayContent({ part }: { part: BuildingPartNode }) {
  const meta = PART_META[part.buildingPartType];
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border-2 ${meta.accentBorder} ${meta.accentBg} px-4 py-3 shadow-2xl cursor-grabbing backdrop-blur-sm`}
      style={{ width: 280 }}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-bold text-foreground">
          {part.name}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {part.area} m²
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BuildingPardts({
  className = "",
}: BuildingPardtsProps) {
  const [parts, setParts] = useState<BuildingPartNode[]>(INITIAL_PARTS);
  const [activePart, setActivePart] = useState<BuildingPartNode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<{
    parentId: string | null;
    allowedTypes: EBuildingPartType[];
    parentName: string;
  }>({ parentId: null, allowedTypes: [], parentName: "" });

  const dragRef = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const topLevel = useMemo(() => getChildren(parts, null), [parts]);

  const totalArea = useMemo(
    () => parts.reduce((sum, p) => sum + p.area, 0),
    [parts],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const part = (event.active.data.current as { part: BuildingPartNode })
      ?.part;
    if (part) {
      setActivePart(part);
      dragRef.current = part.id;
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActivePart(null);
    dragRef.current = null;

    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    if (draggedId === overId) return;

    setParts((prev) => {
      const dragged = prev.find((p) => p.id === draggedId);
      const overPart = prev.find((p) => p.id === overId);

      if (!dragged || !overPart) return prev;

      // Can't drop a container into its own child
      if (prev.some((p) => p.parentId === draggedId && p.id === overId)) {
        return prev;
      }

      const overAllowed = CHILD_TYPES_MAP[overPart.buildingPartType] ?? [];
      if (!overAllowed.includes(dragged.buildingPartType)) return prev;

      // Prevent dropping onto self or own descendant
      const isDescendant = (checkId: string, ancestorId: string): boolean => {
        const children = prev.filter((p) => p.parentId === ancestorId);
        return children.some(
          (c) => c.id === checkId || isDescendant(checkId, c.id),
        );
      };
      if (isDescendant(overId, draggedId)) return prev;

      return prev.map((p) =>
        p.id === draggedId ? { ...p, parentId: overId } : p,
      );
    });
  }, []);

  const handleAddPart = useCallback((newPart: Omit<BuildingPartNode, "id">) => {
    const id = `part_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setParts((prev) => [...prev, { ...newPart, id }]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setParts((prev) => {
      const idsToRemove = new Set<string>();
      const collect = (parentId: string) => {
        idsToRemove.add(parentId);
        prev
          .filter((p) => p.parentId === parentId)
          .forEach((child) => collect(child.id));
      };
      collect(id);
      return prev.filter((p) => !idsToRemove.has(p.id));
    });
  }, []);

  const openAddModal = useCallback(
    (parentId: string, allowedTypes: EBuildingPartType[]) => {
      const parent = parts.find((p) => p.id === parentId);
      setAddTarget({
        parentId,
        allowedTypes,
        parentName: parent?.name ?? "Building",
      });
      setModalOpen(true);
    },
    [parts],
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Building Structure
            </h2>
            <p className="text-sm text-muted-foreground">
              Drag parts between floors to reorganize
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-2.5 shadow-card">
            <div className="text-center">
              <p className="text-lg font-bold tabular-nums text-foreground">
                {topLevel.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Sections
              </p>
            </div>
            <div className="h-8 w-px bg-border/40" />
            <div className="text-center">
              <p className="text-lg font-bold tabular-nums text-foreground">
                {parts.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Total Parts
              </p>
            </div>
            <div className="h-8 w-px bg-border/40" />
            <div className="text-center">
              <p className="text-lg font-bold tabular-nums text-primary">
                {totalArea.toLocaleString()}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Total m²
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DnD Context */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {topLevel.map((part, i) => (
              <motion.div
                key={part.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: i * 0.05,
                }}
              >
                <DroppableCard
                  part={part}
                  parts={parts}
                  onAdd={() => {}}
                  onDelete={handleDelete}
                  onAddChild={openAddModal}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <DragOverlay dropAnimation={{ duration: 200 }}>
          {activePart ? <DragOverlayContent part={activePart} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Empty state */}
      {topLevel.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/40 py-20 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Building2 className="h-8 w-8 text-primary/40" />
          </div>
          <p className="text-base font-bold text-foreground mb-1">
            No building parts yet
          </p>
          <p className="text-sm text-muted-foreground">
            Start by adding floors and sections
          </p>
        </motion.div>
      )}

      {/* Add Part Modal */}
      <AddPartModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        allowedTypes={addTarget.allowedTypes}
        parentName={addTarget.parentName}
        onAdd={handleAddPart}
      />
    </div>
  );
}
