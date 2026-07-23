import type { BuildingType } from "../api/types";

export const BUILDING_TYPES: { value: BuildingType; label: string }[] = [
  { value: "Residential", label: "سكني" },
  { value: "Commercial", label: "تجاري" },
  { value: "Industrial", label: "صناعي" },
  { value: "Administrative", label: "إداري" },
  { value: "Educational", label: "تعليمي" },
  { value: "Healthcare", label: "صحي" },
  { value: "Religious", label: "ديني" },
  { value: "MixedUse", label: "متعدد الاستخدامات" },
  { value: "Infrastructure", label: "بنية تحتية" },
  { value: "Other", label: "أخرى" },
];
