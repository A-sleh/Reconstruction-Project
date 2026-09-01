import { useTranslation } from "react-i18next";

import { Construction, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KpiCard from "@/components/shared/KpiCard";

export default function EngineersPanel({
  totalMembers,
}: {
  totalMembers?: number;
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{t("project.financial.engineersPanel.title")}</CardTitle>
            <CardDescription>
              {t("project.financial.engineersPanel.subtitle")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <KpiCard
            icon={Users}
            label={t("project.financial.engineersPanel.totalMembers")}
            value={String(totalMembers ?? 0)}
            accent="bg-slate-500/10 text-slate-600"
          />
        </div>

        <div className="rounded-xl border border-dashed p-6 text-center">
          <Construction className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">
            {t("project.financial.engineersPanel.pendingTitle")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("project.financial.engineersPanel.pendingDesc")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
