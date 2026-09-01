import { Activity, HardHat, Repeat2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import KpiCard from "@/components/shared/KpiCard";

interface Props {
  totalActions: number;
  activeEngineers: number;
  avgActionsPerEngineer: number;
  topActionLabel: string;
}

const EngineerDashboardKpis = ({
  totalActions,
  activeEngineers,
  avgActionsPerEngineer,
  topActionLabel,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Activity}
        label={t(
          "projectsEngineers.dashboard.kpis.totalActions",
          "Total Actions",
        )}
        value={String(totalActions)}
        hint={t(
          "projectsEngineers.dashboard.kpis.totalActionsHint",
          "Across all engineer activity logs",
        )}
        accent="bg-primary/10 text-primary"
      />
      <KpiCard
        icon={HardHat}
        label={t(
          "projectsEngineers.dashboard.kpis.activeEngineers",
          "Active Engineers",
        )}
        value={String(activeEngineers)}
        hint={t(
          "projectsEngineers.dashboard.kpis.activeEngineersHint",
          "Engineers with recorded activity",
        )}
        accent="bg-emerald-500/10 text-emerald-600"
      />
      <KpiCard
        icon={Repeat2}
        label={t(
          "projectsEngineers.dashboard.kpis.avgActions",
          "Actions / Engineer",
        )}
        value={avgActionsPerEngineer.toFixed(1)}
        hint={t(
          "projectsEngineers.dashboard.kpis.avgActionsHint",
          "Average per active engineer",
        )}
        accent="bg-amber-500/10 text-amber-600"
      />
      <KpiCard
        icon={Star}
        label={t(
          "projectsEngineers.dashboard.kpis.topAction",
          "Most Frequent Action",
        )}
        value={topActionLabel}
        hint={t(
          "projectsEngineers.dashboard.kpis.topActionHint",
          "Top activity in the selected period",
        )}
        accent="bg-indigo-500/10 text-indigo-600"
      />
    </div>
  );
};

export default EngineerDashboardKpis;