import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { Input } from "@/components/ui/input";
import type { BuildingPartType } from "@/features/investor/buildings/api/types";

import type { ReportBuildingPart } from "../utils/buildingPartsHelpers";
import { PART_META } from "../utils/buildingPartsMeta";

export function AddPartModal({
  open,
  onOpenChange,
  allowedTypes,
  parentName,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowedTypes: BuildingPartType[];
  parentName: string;
  editing: ReportBuildingPart | null;
  onSave: (part: Omit<ReportBuildingPart, "id" | "subParts">) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState<BuildingPartType>(
    allowedTypes[0] ?? "Floor",
  );
  const [step, setStep] = useState<"form" | "confirm">("form");

  const isEditing = editing !== null;
  const meta = PART_META[type];

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setArea(String(editing.area));
      setType(editing.buildingPartType);
    }
  }, [editing]);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      if (editing) {
        setName(editing.name);
        setArea(String(editing.area));
        setType(editing.buildingPartType);
      }
      setStep("form");
    } else {
      handleClose();
    }
  };

  const handleSubmit = () => {
    if (step === "form") {
      setStep("confirm");
      return;
    }
    if (!name.trim() || !area || Number(area) <= 0) return;
    onSave({ name: name.trim(), area: Number(area), buildingPartType: type });
    handleClose();
  };

  const handleClose = () => {
    setStep("form");
    setName("");
    setArea("");
    onOpenChange(false);
  };

  const title = isEditing
    ? t("projectReports.create.achievement.editTitle", "Edit Part")
    : t("projectReports.create.achievement.addTitle", "Add New Part");

  const confirmTitle = isEditing
    ? t("projectReports.create.achievement.confirmEditTitle", "Confirm Changes")
    : t("projectReports.create.achievement.confirmTitle", "Confirm Addition");

  const description = isEditing ? (
    <span className="flex items-center gap-1.5">
      <Pencil className="h-3 w-3" />
      {t("projectReports.create.achievement.editingName", "Editing {{name}}", {
        name: editing?.name ?? "",
      })}
    </span>
  ) : (
    t("projectReports.create.achievement.addingTo", "Adding to {{parent}}", {
      parent: parentName,
    })
  );

  const confirmHint = isEditing
    ? t(
        "projectReports.create.achievement.confirmSaveHint",
        "Your changes will be saved to the building structure.",
      )
    : t(
        "projectReports.create.achievement.confirmHint",
        "This part will be added to the building structure. You can drag it to a different section later.",
      );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className={`bg-gradient-to-r ${meta.gradient} px-6 pb-4 pt-6`}>
          <DialogHeader className="text-left">
            <div className="mb-1 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
              >
                <meta.icon className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {step === "form" ? title : confirmTitle}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {step === "form"
                    ? description
                    : t(
                        "projectReports.create.achievement.reviewHint",
                        "Review before adding",
                      )}
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
                <div>
                  <p className="mb-2 block text-xs font-semibold text-foreground">
                    {t("projectReports.create.achievement.type", "Part Type")}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {allowedTypes.map((ct) => {
                      const m = PART_META[ct];
                      const selected = type === ct;
                      return (
                        <button
                          key={ct}
                          type="button"
                          onClick={() => setType(ct)}
                          className={`flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                            selected
                              ? `${m.accentBg} ${m.accentBorder} ring-2 ring-offset-1 ring-primary/20`
                              : "border-border/40 hover:border-border hover:bg-muted/30"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              selected ? m.accentBg : "bg-muted/60"
                            } ${selected ? m.color : "text-muted-foreground"}`}
                          >
                            <m.icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-sm font-semibold ${selected ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {t(
                              `projectReports.create.achievement.types.${ct}`,
                              m.label,
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 block text-xs font-semibold text-foreground">
                    {t("projectReports.create.achievement.name", "Name")}
                  </p>
                  <Input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t(
                      "projectReports.create.achievement.namePlaceholder",
                      "e.g. Master Bedroom",
                    )}
                  />
                </div>

                <div>
                  <p className="mb-2 block text-xs font-semibold text-foreground">
                    {t("projectReports.create.achievement.area", "Area (m²)")}
                  </p>
                  <Input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={t(
                      "projectReports.create.achievement.areaPlaceholder",
                      "e.g. 25",
                    )}
                    min={1}
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
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
                    >
                      <meta.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-0.5 border text-[10px] font-semibold ${meta.accentBorder} ${meta.accentBg} ${meta.color}`}
                      >
                        {t(
                          `projectReports.create.achievement.types.${type}`,
                          meta.label,
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/40 bg-card p-3">
                      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {t(
                          "projectReports.create.achievement.area",
                          "Area (m²)",
                        )}
                      </p>
                      <p className="text-lg font-bold tabular-nums text-foreground">
                        {area} m²
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-card p-3">
                      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {t(
                          "projectReports.create.achievement.parent",
                          "Parent",
                        )}
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {parentName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs text-foreground">{confirmHint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0">
          {step === "confirm" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("form")}
              className="mr-auto"
            >
              {t("projectReports.create.achievement.back", "Back")}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("projectReports.create.achievement.cancel", "Cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || !area || Number(area) <= 0}
            className="gap-1.5"
          >
            {step === "form" ? (
              <>
                {t("projectReports.create.achievement.review", "Review")}
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            ) : isEditing ? (
              <>
                <Check className="h-4 w-4" />
                {t("projectReports.create.achievement.save", "Save Changes")}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {t("projectReports.create.achievement.confirmAdd", "Add Part")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
