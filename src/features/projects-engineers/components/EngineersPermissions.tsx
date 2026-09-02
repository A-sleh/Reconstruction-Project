import { useMemo, useState } from "react";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";

import { useProjectMembersPermissions, useUpdateProjectEngineerPermissions } from "../api/actions";
import type {
  GetProjectEngineersPermissionsFilters,
  ProjectEngineerPermissionFlags,
} from "../api/types";
import EngineersPermssionFilters from "./EngineersPermssionFilters";
import EngineersPersmssionTable from "./EngineersPersmssionTable";

interface Props {
  projectId: number;
}

const EngineersPermissions = ({ projectId }: Props) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetProjectEngineersPermissionsFilters>(
    {},
  );

  const { data = [], isLoading } = useProjectMembersPermissions(projectId);
  const updatePermissions = useUpdateProjectEngineerPermissions();

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        !filters.search ||
        row.engineerName
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesPermissions =
        !filters.permissions ||
        Object.entries(filters.permissions).every(
          ([key, value]) =>
            value === true &&
            row.permissions[key as keyof ProjectEngineerPermissionFlags] ===
              true,
        );

      return matchesSearch && matchesPermissions;
    });
  }, [data, filters]);

  const handleUpdate = (
    engineerId: number,
    permissions: ProjectEngineerPermissionFlags,
  ) => {
    updatePermissions.mutate({
      projectId,
      engineerId,
      ...permissions,
    });
  };

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
          {filtered.length === 0 && !isLoading ? (
            <EmptyState
              icon={ShieldCheck}
              message={t(
                "projectsEngineers.permissions.empty",
                "No engineers match your filters.",
              )}
            />
          ) : (
            <EngineersPersmssionTable
              data={filtered}
              isLoading={isLoading}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineersPermissions;
