import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fmtCurrency } from "@/lib/helpers";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SiteOperationalStatusProps {
  byCategory: { name: string; value: number }[];
}

const SiteOperationalStatus = ({ byCategory }: SiteOperationalStatusProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <span>
            {t("resourceProvidor.statistics.inventoryCategory.title")}
          </span>
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.inventoryCategory.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {byCategory.map((c) => {
          const max = byCategory[0]?.value || 1;
          const pct = Math.round((c.value / max) * 100);

          return (
            <div key={c.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                {/* Dynamically checks for translated category names, falls back to original if absent */}
                <span className="font-medium">
                  {t(
                    `resourceProvidor.statistics.inventoryCategory.categories.${c.name}`,
                  )}
                </span>
                <span className="text-muted-foreground">
                  {fmtCurrency(c.value)}
                </span>
              </div>
              <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {byCategory.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("resourceProvidor.statistics.inventoryCategory.noData")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SiteOperationalStatus;
