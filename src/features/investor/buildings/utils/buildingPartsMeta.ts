import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Briefcase,
  Building2,
  CookingPot,
  DoorOpen,
  Home,
  Landmark,
  Layers,
} from "lucide-react";

import type { BuildingPartType } from "@/features/investor/buildings/api/types";

export interface PartMeta {
  icon: LucideIcon;
  color: string;
  accentBg: string;
  accentBorder: string;
  softBg: string;
  label: string;
  gradient: string;
}

export const PART_META: Record<BuildingPartType, PartMeta> = {
  Floor: {
    icon: Layers,
    color: "text-blue-600",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
    softBg: "bg-blue-500/5",
    label: "Floor",
    gradient: "from-blue-500/8 to-transparent",
  },
  Room: {
    icon: DoorOpen,
    color: "text-emerald-600",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20",
    softBg: "bg-emerald-500/5",
    label: "Room",
    gradient: "from-emerald-500/8 to-transparent",
  },
  Bathroom: {
    icon: Bath,
    color: "text-cyan-600",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20",
    softBg: "bg-cyan-500/5",
    label: "Bathroom",
    gradient: "from-cyan-500/8 to-transparent",
  },
  Kitchen: {
    icon: CookingPot,
    color: "text-orange-600",
    accentBg: "bg-orange-500/10",
    accentBorder: "border-orange-500/20",
    softBg: "bg-orange-500/5",
    label: "Kitchen",
    gradient: "from-orange-500/8 to-transparent",
  },
  Office: {
    icon: Briefcase,
    color: "text-violet-600",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/20",
    softBg: "bg-violet-500/5",
    label: "Office",
    gradient: "from-violet-500/8 to-transparent",
  },
  Hall: {
    icon: Landmark,
    color: "text-amber-600",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20",
    softBg: "bg-amber-500/5",
    label: "Hall",
    gradient: "from-amber-500/8 to-transparent",
  },
  Roof: {
    icon: Home,
    color: "text-rose-600",
    accentBg: "bg-rose-500/10",
    accentBorder: "border-rose-500/20",
    softBg: "bg-rose-500/5",
    label: "Roof",
    gradient: "from-rose-500/8 to-transparent",
  },
};

export { Building2 };
