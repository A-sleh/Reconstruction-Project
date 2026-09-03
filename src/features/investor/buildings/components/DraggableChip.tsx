import { motion } from "framer-motion";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDraggable } from "@dnd-kit/core";

import type { ReportBuildingPart } from "../utils/buildingPartsHelpers";
import { PART_META } from "../utils/buildingPartsMeta";

export function DraggableChip({
  part,
  onEdit,
  onDelete,
}: {
  part: ReportBuildingPart;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
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
      className={`group/chip relative flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${meta.softBg} ${meta.accentBorder} ${
        isDragging
          ? "z-50 shadow-lg ring-2 ring-primary/20"
          : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-white/60 hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </button>

      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta.accentBg} ${meta.color}`}
      >
        <meta.icon className="h-4 w-4" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold leading-tight text-foreground">
          {part.name}
        </span>
        <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {part.area.toLocaleString()} m² ·{" "}
          {t(
            `projectReports.create.achievement.types.${part.buildingPartType}`,
            meta.label,
          )}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={() => onEdit(part.id)}
          title={t("projectReports.create.achievement.edit", "Edit part")}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/0 transition-all group-hover/chip:text-muted-foreground/60 hover:!bg-primary/10 hover:!text-primary"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(part.id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground/0 transition-all group-hover/chip:text-muted-foreground/60 hover:!bg-destructive/10 hover:!text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}