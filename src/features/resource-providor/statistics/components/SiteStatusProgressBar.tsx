import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SiteStatusProgressBarProps {
  siteStatus: { name: string; value: number }[];
  totoalSites: number;
  avgProgress: number;
}


const SiteStatusProgressBar = ({
  siteStatus,
  avgProgress,
  totoalSites,
}: SiteStatusProgressBarProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.siteStatus.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.siteStatus.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        {siteStatus.map((s) => {
          const pct = totoalSites
            ? Math.round((s.value / totoalSites) * 100)
            : 0;

          return (
            <div key={s.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">
                  {t(
                    `resourceProvider.statistics.siteStatus.states.${s.name}`,
                    {
                      defaultValue: s.name,
                    },
                  )}
                </span>
                <span className="text-muted-foreground">
                  {isArabic ? `${pct}% · ${s.value}` : `${s.value} · ${pct}%`}
                </span>
              </div>

              {/* Target the inner progress indicator via a clean selector injection */}
              <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-2 border-t border-gray-300 ">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp
              className={`h-4 w-4 text-emerald-600 ${isArabic ? "scale-x-[-1]" : ""}`}
            />
            <span>
              {t("resourceProvidor.statistics.siteStatus.avgProgress")}
              <span className="font-semibold text-foreground mx-1" dir="ltr">
                {avgProgress} %
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteStatusProgressBar;
