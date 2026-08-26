import { useMemo, useState } from "react";

import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";

import type { GetEmploersActionsLogsFilters } from "../api/types";
import { MOCK_EMPLOERS_ACTIONS_LOGS } from "../mock/mockEmploersLogs";
import EngineersLoagsTable from "./EngineersLoagsTable";
import EngineersLogsFilters from "./EngineersLogsFilters";

const EngineersLogs = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetEmploersActionsLogsFilters>({});

  const logs = useMemo(() => {
    return MOCK_EMPLOERS_ACTIONS_LOGS.filter((log) => {
      const q = filters.search?.trim().toLowerCase();
      const matchesSearch =
        !q ||
        log.engineerId.fullName.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.workSite.toLowerCase().includes(q) ||
        t(`projectsEngineers.logs.actions.${log.action}`)
          .toLowerCase()
          .includes(q);

      const logDate = new Date(log.createdAt).getTime();
      const matchesFrom =
        !filters.fromDate || logDate >= new Date(filters.fromDate).getTime();
      const matchesTo =
        !filters.toDate ||
        logDate <= new Date(filters.toDate).getTime() + 86_399_000;

      const matchesAction = !filters.action || log.action === filters.action;

      return matchesSearch && matchesFrom && matchesTo && matchesAction;
    });
  }, [filters, t]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">
            {t("projectsEngineers.logs.header.title", "Engineers Activity")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(
              "projectsEngineers.logs.header.subTitle",
              "Track what engineers do inside the project.",
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2">
          <EngineersLogsFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="space-y-5 lg:order-1">
          {logs.length === 0 ? (
            <EmptyState
              icon={Activity}
              message={t("projectsEngineers.logs.empty", "No activity found.")}
            />
          ) : (
            <EngineersLoagsTable logs={logs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineersLogs;
