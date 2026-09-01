import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutDashboard } from "lucide-react";

import type { EmploersActionsLogs } from "../api/types";
import { ENGINEERS_PROJECT_ACTIONS } from "../api/types";
import { MOCK_EMPLOERS_ACTIONS_LOGS } from "../mock/mockEmploersLogs";
import { MOCK_ENGINEERS } from "../mock/mockEngineers";
import ActionsByTypeChart, {
  type ActionCountEntry,
} from "./ActionsByTypeChart";
import ActionsTimelineChart from "./ActionsTimelineChart";
import DashboardFilters, {
  type DashboardFiltersState,
} from "./DashboardFilters";
import EngineerActivityTable, {
  type EngineerActivityRow,
} from "./EngineerActivityTable";
import EngineerDashboardKpis from "./EngineerDashboardKpis";
import EngineerSpecBreakdown from "./EngineerSpecBreakdown";
import TopEngineersChart, {
  type TopEngineerEntry,
} from "./TopEngineersChart";

const toDateInputValue = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const EngineersDashboard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [filters, setFilters] = useState<DashboardFiltersState>({});

  const filteredLogs = useMemo(() => {
    const from = filters.fromDate ? new Date(filters.fromDate).getTime() : null;
    const to = filters.toDate ? new Date(filters.toDate).getTime() : null;
    return MOCK_EMPLOERS_ACTIONS_LOGS.filter((log) => {
      const time = new Date(log.createdAt).getTime();
      if (from != null && time < from) return false;
      if (to != null && time > to + 86_399_000) return false;
      return true;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const totalActions = filteredLogs.length;

    const engineersById = new Map<number, EmploersActionsLogs["engineerId"]>();
    MOCK_ENGINEERS.forEach((e) => {
      if (!engineersById.has(e.id)) engineersById.set(e.id, e);
    });
    const uniqueEngineers = Array.from(engineersById.values());

    const perEngineer = new Map<number, number>();
    const engineersWithActions = new Map<number, boolean>();
    filteredLogs.forEach((log) => {
      perEngineer.set(
        log.engineerId.id,
        (perEngineer.get(log.engineerId.id) ?? 0) + 1,
      );
      engineersWithActions.set(log.engineerId.id, true);
    });

    const activeEngineers = engineersWithActions.size;

    const actionCounts: Record<string, number> = {};
    filteredLogs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] ?? 0) + 1;
    });

    let topAction: string = ENGINEERS_PROJECT_ACTIONS[0];
    let topActionCount = 0;
    Object.entries(actionCounts).forEach(([action, count]) => {
      if (count > topActionCount) {
        topAction = action;
        topActionCount = count;
      }
    });

    const byTypeData: ActionCountEntry[] = ENGINEERS_PROJECT_ACTIONS.map(
      (action) => ({
        name: t(`projectsEngineers.logs.actions.${action}`),
        action,
        count: actionCounts[action] ?? 0,
      }),
    );

    const daily: Record<string, number> = {};
    filteredLogs.forEach((log) => {
      const key = toDateInputValue(new Date(log.createdAt));
      daily[key] = (daily[key] ?? 0) + 1;
    });
    const timelineData = Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, count]) => ({ day, count }));

    const topRows: TopEngineerEntry[] = Array.from(perEngineer.entries())
      .map(([engineerId, count]) => ({
        name: engineersById.get(engineerId)?.fullName ?? String(engineerId),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const specCounts: Record<string, number> = {};
    uniqueEngineers.forEach((e) => {
      specCounts[e.spec] = (specCounts[e.spec] ?? 0) + 1;
    });
    const specData = Object.entries(specCounts).map(([name, count]) => ({
      name,
      count,
    }));

const engineerRowMap = new Map<number, EngineerActivityRow>();
    filteredLogs.forEach((log) => {
      const engineerId = log.engineerId.id;
      let row = engineerRowMap.get(engineerId);
      if (!row) {
        row = {
          name: log.engineerId.fullName,
          spec: log.engineerId.spec,
          total: 0,
          counts: {},
        };
        engineerRowMap.set(engineerId, row);
      }
      row.total += 1;
      row.counts[log.action] = (row.counts[log.action] ?? 0) + 1;
    });
    const leaderboardRows = Array.from(engineerRowMap.values()).sort(
      (a, b) => b.total - a.total,
    );

    const avgActionsPerEngineer =
      activeEngineers > 0 ? totalActions / activeEngineers : 0;

    return {
      totalActions,
      activeEngineers,
      avgActionsPerEngineer,
      topActionLabel: t(`projectsEngineers.logs.actions.${topAction}`),
      byTypeData,
      timelineData,
      topRows,
      specData,
      leaderboardRows,
    };
  }, [filteredLogs, t]);

  return (
    <div className="space-y-5" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t(
                "projectsEngineers.dashboard.header.title",
                "Engineers Dashboard",
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "projectsEngineers.dashboard.header.subTitle",
                "Monitor and measure engineers' actions inside the project.",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2">
          <DashboardFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="space-y-6 lg:order-1">
          <EngineerDashboardKpis
            totalActions={stats.totalActions}
            activeEngineers={stats.activeEngineers}
            avgActionsPerEngineer={stats.avgActionsPerEngineer}
            topActionLabel={stats.topActionLabel}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <ActionsByTypeChart data={stats.byTypeData} isArabic={isArabic} />
            <TopEngineersChart data={stats.topRows} isArabic={isArabic} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ActionsTimelineChart data={stats.timelineData} isArabic={isArabic} />
            <EngineerSpecBreakdown data={stats.specData} isArabic={isArabic} />
          </div>

          <EngineerActivityTable rows={stats.leaderboardRows} />
        </div>
      </div>
    </div>
  );
};

export default EngineersDashboard;