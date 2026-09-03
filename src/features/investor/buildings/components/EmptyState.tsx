import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Building2 } from "../utils/buildingPartsMeta";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/40 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Building2 className="h-8 w-8 text-primary/40" />
      </div>
      <p className="text-base font-bold text-foreground">
        {t(
          "projectReports.create.achievement.empty",
          "No building parts added yet.",
        )}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(
          "projectReports.create.achievement.emptyHint",
          "Add floors or sections to build the structure.",
        )}
      </p>
      <Button type="button" onClick={onAdd} className="mt-4 gap-1.5">
        <Plus className="h-4 w-4" />
        {t("projectReports.create.achievement.addFloor", "Add Floor")}
      </Button>
    </div>
  );
}