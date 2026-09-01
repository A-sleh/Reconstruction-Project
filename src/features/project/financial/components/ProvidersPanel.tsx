import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  FlaskConical,
  HardHat,
  Info,
  Truck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import KpiCard from "@/components/shared/KpiCard";
import { fmtCurrency } from "@/lib/helpers";
import type { ProjectTransaction } from "../api/types";

export default function ProvidersPanel({
  transactions,
  onNavigate,
}: {
  transactions: ProjectTransaction[];
  onNavigate: (key: string) => void;
}) {
  const { t, i18n } = useTranslation();

  const resourceTx = useMemo(
    () =>
      transactions.filter((tx) => tx.category === "provider-resource"),
    [transactions],
  );
  const serviceTx = useMemo(
    () =>
      transactions.filter((tx) => tx.category === "provider-service"),
    [transactions],
  );

  const resourceTotal = useMemo(
    () => resourceTx.reduce((sum, tx) => sum + tx.amount, 0),
    [resourceTx],
  );
  const serviceTotal = useMemo(
    () => serviceTx.reduce((sum, tx) => sum + tx.amount, 0),
    [serviceTx],
  );

  const visibleRows = useMemo(() => transactions.slice(0, 6), [transactions]);

  const locale = i18n.language === "ar" ? "ar-SY" : "en-US";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("project.financial.providersPanel.title")}</CardTitle>
        <CardDescription>
          {t("project.financial.providersPanel.subtitle")}
        </CardDescription>
        <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>{t("project.financial.providersPanel.intro")}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            <Badge variant="outline">
              {t("project.financial.providersPanel.sampleNotice")}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <KpiCard
            icon={Truck}
            label={t("project.financial.categories.provider-resource")}
            value={fmtCurrency(resourceTotal)}
          />
          <KpiCard
            icon={HardHat}
            label={t("project.financial.categories.provider-service")}
            value={fmtCurrency(serviceTotal)}
          />
        </div>

        <div className="space-y-2">
          {visibleRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("project.financial.ledger.empty")}
            </p>
          ) : (
            visibleRows.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {tx.counterParty}
                    </p>
                    {tx.source === "sample" && (
                      <Badge variant="outline">
                        {t("project.financial.ledger.sampleBadge")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString(locale)}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold tabular-nums ${
                    tx.direction === "income"
                      ? "text-emerald"
                      : "text-foreground"
                  }`}
                >
                  {fmtCurrency(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        <Separator />

        <div className="flex flex-wrap gap-3">
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
        </div>
      </CardContent>
    </Card>
  );
}
