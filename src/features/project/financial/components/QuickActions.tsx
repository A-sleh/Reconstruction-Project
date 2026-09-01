import { useTranslation } from "react-i18next";

import { HardHat, Plus, Truck, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActions({
  onNavigate,
}: {
  onNavigate: (key: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          <CardTitle>{t("project.financial.actions.title")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled
          title={t("project.financial.actions.recordTransactionHint")}
        >
          <Plus />
          {t("project.financial.actions.recordTransaction")}
        </Button>
        <Button
          variant="outline"
          onClick={() => onNavigate("manage resources")}
        >
          <Truck />
          {t("project.financial.providersPanel.manageResources")}
        </Button>
        <Button
          variant="outline"
          onClick={() => onNavigate("manage services")}
        >
          <HardHat />
          {t("project.financial.providersPanel.manageServices")}
        </Button>
      </CardContent>
    </Card>
  );
}
