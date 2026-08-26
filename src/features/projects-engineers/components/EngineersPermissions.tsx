import { useMemo, useState } from "react";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";

import type { GetProjectEngineersPermissionsFilters } from "../api/types";
import { MOCK_PROJECT_ENGINEERS_PERMISSIONS } from "../mock/mockPermissions";
import EngineersPermssionFilters from "./EngineersPermssionFilters";
import EngineersPersmssionTable from "./EngineersPersmssionTable";

const EngineersPermissions = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetProjectEngineersPermissionsFilters>(
    {},
  );

  const data = useMemo(() => {
    return MOCK_PROJECT_ENGINEERS_PERMISSIONS.filter((row) => {
      const matchesSearch =
        !filters.search ||
        row.engineer.fullName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        row.engineer.spec.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPermissions =
        !filters.permissions ||
        Object.entries(filters.permissions).every(
          ([key, value]) =>
            value === true &&
            row.permissions[key as keyof typeof row.permissions] === true,
        );

      return matchesSearch && matchesPermissions;
    });
  }, [filters]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t(
                "projectsEngineers.permissions.header.title",
                "Engineers Permissions",
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "projectsEngineers.permissions.header.subTitle",
                "Manage what each engineer can do in your project.",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2">
          <EngineersPermssionFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="lg:order-1">
          {data.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              message={t(
                "projectsEngineers.permissions.empty",
                "No engineers match your filters.",
              )}
            />
          ) : (
            <EngineersPersmssionTable data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineersPermissions;
