import { useCallback, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type { BuildingPartType } from "@/features/investor/buildings/api/types";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  addChild,
  CHILD_TYPES_MAP,
  countParts,
  createPart,
  findPart,
  findParentPart,
  movePart,
  removePartById,
  type ReportBuildingPart,
  totalArea,
  updatePart,
} from "../utils/buildingPartsHelpers";
import { AddPartModal } from "./AddPartModal";
import { DragOverlayContent } from "./DragOverlayContent";
import { DroppableCard } from "./DroppableCard";
import { EmptyState } from "./EmptyState";

const AchievementBuildingParts = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();

  const tree: ReportBuildingPart[] = watch(
    "buildingParts",
    [] as ReportBuildingPart[],
  );

  const setTree = useCallback(
    (next: ReportBuildingPart[]) =>
      setValue("buildingParts", next, { shouldValidate: true }),
    [setValue],
  );

  const [activePart, setActivePart] = useState<ReportBuildingPart | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingPart, setUpdatingPart] = useState<ReportBuildingPart | null>(
    null,
  );
  const [addTarget, setAddTarget] = useState<{
    parentId: string | null;
    allowedTypes: BuildingPartType[];
    parentName: string;
  }>({ parentId: null, allowedTypes: [], parentName: "" });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const topLevel = tree;
  const totalAreas = useMemo(() => totalArea(tree), [tree]);
  const partCount = useMemo(() => countParts(tree), [tree]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const part = (event.active.data.current as { part: ReportBuildingPart })
      ?.part;
    if (part) setActivePart(part);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActivePart(null);
      if (!over) return;
      setTree(movePart(tree, String(active.id), String(over.id)));
    },
    [setTree, tree],
  );

  const openAddModal = useCallback(
    (parentId: string | null) => {
      if (parentId === null) {
        setAddTarget({
          parentId,
          allowedTypes: ["Floor", "Roof"],
          parentName: t(
            "projectReports.create.achievement.building",
            "Building",
          ),
        });
      } else {
        const parent = findPart(tree, parentId);
        if (!parent) return;
        setAddTarget({
          parentId,
          allowedTypes: CHILD_TYPES_MAP[parent.buildingPartType] ?? [],
          parentName: parent.name,
        });
      }
      setUpdatingPart(null);
      setModalOpen(true);
    },
    [tree, t],
  );

  const handleAdd = useCallback(
    (part: Omit<ReportBuildingPart, "id" | "subParts">) => {
      setTree(
        addChild(
          tree,
          createPart(part.name, part.area, part.buildingPartType),
          addTarget.parentId,
        ),
      );
    },
    [setTree, tree, addTarget.parentId],
  );

  const openEditModal = useCallback(
    (id: string) => {
      const part = findPart(tree, id);
      if (!part) return;
      const parent = findParentPart(tree, id);
      setAddTarget({
        parentId: parent ? parent.id : null,
        allowedTypes:
          parent && parent.id !== null
            ? [...(CHILD_TYPES_MAP[parent.buildingPartType] ?? []), part.buildingPartType]
                .filter((v, i, a) => a.indexOf(v) === i)
            : ["Floor", "Roof", part.buildingPartType].filter(
                (v, i, a) => a.indexOf(v) === i,
              ),
        parentName: parent ? parent.name : t(
          "projectReports.create.achievement.building",
          "Building",
        ),
      });
      setUpdatingPart(part);
      setModalOpen(true);
    },
    [tree, t],
  );

  const handleUpdate = useCallback(
    (part: Omit<ReportBuildingPart, "id" | "subParts">) => {
      if (!updatingPart) return;
      setTree(updatePart(tree, updatingPart.id, part));
    },
    [setTree, tree, updatingPart],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setTree(removePartById(tree, id));
    },
    [setTree, tree],
  );

  const handleModalOpenChange = useCallback((next: boolean) => {
    setModalOpen(next);
    if (!next) setUpdatingPart(null);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {t(
              "projectReports.create.achievement.title",
              "Achieved Building Parts",
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              "projectReports.create.achievement.subTitle",
              "Add floors, then build rooms and sections inside them.",
            )}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => openAddModal(null)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          {t("projectReports.create.achievement.addFloor", "Add Floor")}
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card px-5 py-3">
        <div className="text-center">
          <p className="text-lg font-bold tabular-nums text-foreground">
            {topLevel.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t(
              "projectReports.create.achievement.summarySections",
              "{{count}} section(s)",
              {
                count: topLevel.length,
              },
            )}
          </p>
        </div>
        <div className="h-8 w-px bg-border/40" />
        <div className="text-center">
          <p className="text-lg font-bold tabular-nums text-foreground">
            {partCount}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t(
              "projectReports.create.achievement.summaryParts",
              "{{count}} part(s)",
              {
                count: partCount,
              },
            )}
          </p>
        </div>
        <div className="h-8 w-px bg-border/40" />
        <div className="text-center">
          <p className="text-lg font-bold tabular-nums text-primary">
            {totalAreas.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("projectReports.create.achievement.summaryArea", "m² total")}
          </p>
        </div>
      </div>

      {topLevel.length === 0 ? (
        <EmptyState onAdd={() => openAddModal(null)} />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                    onDelete={handleDelete}
                    onEdit={openEditModal}
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
      )}

      <AddPartModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        allowedTypes={addTarget.allowedTypes}
        parentName={addTarget.parentName}
        editing={updatingPart}
        onSave={updatingPart ? handleUpdate : handleAdd}
      />
    </div>
  );
};

export default AchievementBuildingParts;