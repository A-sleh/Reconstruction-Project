import SidebarFilters from "@/components/common/SidebarFilters";
import Input from "@/components/inputs/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

import {
  PROJECT_ENGINEER_PERMISSION_KEYS,
  type GetProjectEngineersPermissionsFilters,
  type ProjectEngineerPermissionFlags,
} from "../api/types";

interface Props {
  filters: GetProjectEngineersPermissionsFilters;
  onChange: (next: GetProjectEngineersPermissionsFilters) => void;
}

const PERMISSION_KEYS =
  PROJECT_ENGINEER_PERMISSION_KEYS satisfies readonly (keyof ProjectEngineerPermissionFlags)[];

const EngineersPermssionFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();

  const reset = () => onChange({});
  const activeCount =
    (filters.search ? 1 : 0) +
    PERMISSION_KEYS.filter((k) => filters.permissions?.[k] !== undefined).length;

  const togglePermission = (key: keyof ProjectEngineerPermissionFlags) => {
    const current = filters.permissions?.[key];
    const nextPermissions = { ...filters.permissions };
    if (current === true) {
      delete nextPermissions[key];
    } else {
      nextPermissions[key] = true;
    }
    const hasAny = Object.keys(nextPermissions).length > 0;
    onChange({
      ...filters,
      permissions: hasAny ? nextPermissions : undefined,
    });
  };

  return (
    <SidebarFilters reset={reset} activeCount={activeCount}>
      <div className="mt-4 space-y-6">
        <Input
          label={t(
            "projectsEngineers.permissions.filters.search.label",
            "Search",
          )}
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              search: e.target.value || undefined,
            })
          }
          placeholder={t(
            "projectsEngineers.permissions.filters.search.placeholder",
            "Search by engineer...",
          )}
        />

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t(
              "projectsEngineers.permissions.filters.permissions",
              "Permissions",
            )}
          </Label>
          <div className="space-y-2">
            {PERMISSION_KEYS.map((key) => {
              const checked = filters.permissions?.[key] === true;
              return (
                <label
                  key={key}
                  onClick={(e) => {
                    e.preventDefault();
                    togglePermission(key);
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Checkbox checked={checked} />
                  {t(`projectsEngineers.permissions.labels.${key}`)}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </SidebarFilters>
  );
};

export default EngineersPermssionFilters;
