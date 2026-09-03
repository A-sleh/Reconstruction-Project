import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDroppable } from "@dnd-kit/core";

import { Badge } from "@/components/ui/Badge";
import { AreaRing } from "./AreaRing";
import { DraggableChip } from "./DraggableChip";
import { PartAreaBadgeText } from "./PartAreaBadgeText";
import {
  CHILD_TYPES_MAP,
  isContainer,
  type ReportBuildingPart,
  sumAreas,
} from "../utils/buildingPartsHelpers";
import { PART_META } from "../utils/buildingPartsMeta";

export function DroppableCard({
  part,
  onDelete,
  onEdit,
  onAddChild,
}: {
  part: ReportBuildingPart;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onAddChild: (parentId: string | null) => void;
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const meta = PART_META[part.buildingPartType];
  const children = part.subParts;
  const childArea = sumAreas(children);
  const allowedChildTypes = CHILD_TYPES_MAP[part.buildingPartType] ?? [];
  const container = isContainer(part.buildingPartType);

  const { isOver, setNodeRef } = useDroppable({ id: part.id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
        isOver
          ? "border-primary/50 ring-4 ring-primary/10 shadow-elegant scale-[1.01]"
          : "border-border/60 shadow-card hover:shadow-elegant"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.gradient}`}
      />

      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        {container && (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <motion.div animate={{ rotate: collapsed ? -90 : 0 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
        )}

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
        >
          <meta.icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-foreground">
              {part.name}
            </h3>
            <Badge
              variant="outline"
              className={`border text-[10px] font-semibold ${meta.accentBorder} ${meta.accentBg} ${meta.color} px-2 py-0`}
            >
              {t(
                `projectReports.create.achievement.types.${part.buildingPartType}`,
                meta.label,
              )}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {children.length}{" "}
            {t(
              "projectReports.create.achievement.subPartsCount",
              "sub-part(s)",
              {
                count: children.length,
              },
            )}
          </p>
        </div>

        <PartAreaBadgeText area={part.area} />

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(part.id)}
              title={t(
                "projectReports.create.achievement.edit",
                "Edit part",
              )}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(part.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

      {container && children.length > 0 && (
        <div className="px-5 pb-3">
          <AreaRing used={childArea} total={part.area} />
        </div>
      )}

      {container && !collapsed && (
        <div className="px-5 py-3">
          {children.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {children.map((child) => (
                  <DraggableChip
                    key={child.id}
                    part={child}
                    onEdit={onEdit}
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
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${meta.accentBg}`}
              >
                <Plus className={`h-5 w-5 ${meta.color}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {t(
                  "projectReports.create.achievement.dropHint",
                  "Drop parts here or add new ones",
                )}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => onAddChild(part.id)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("projectReports.create.achievement.addChild", "Add {{types}}", {
              types: allowedChildTypes
                .map((ct) =>
                  t(`projectReports.create.achievement.types.${ct}`, ct),
                )
                .join(" / "),
            })}
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/5"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}