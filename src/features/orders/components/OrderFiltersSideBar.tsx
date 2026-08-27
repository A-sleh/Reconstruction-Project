import { Filter, RotateCcw, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import Input from "@/components/inputs/Input";
import Selector from "@/components/inputs/Selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import {
  GetOrderAllFilters,
  ORDER_STATUSES,
} from "@/features/orders/api/types";
import { useWorkSites } from "@/features/work-sites/api/query";
import { cn } from "@/lib/utils";

interface Props {
  filters: GetOrderAllFilters;
  onChange: (next: GetOrderAllFilters) => void;
  open: boolean;
  onToggle: () => void;
}

export function OrdersFilterSidebar({
  filters,
  onChange,
  open,
  onToggle,
}: Props) {
  const { t } = useTranslation();
  const reset = () => onChange({});
  const { data: workSites = [], isPending: workSitesPending } = useWorkSites();

  const activeCount =
    (filters.SearchByOwner ? 1 : 0) +
    (filters.Status ? 1 : 0) +
    (filters.From ? 1 : 0) +
    (filters.To ? 1 : 0);

  return (
    <aside
      className={cn(
        "shrink-0  border-gray-300 bg-white transition-all duration-300 ease-out overflow-hidden sticky top-25 self-start rounded-md",
        open ? "w-60" : "w-0",
      )}
      style={{ maxHeight: "calc(100vh - 4rem)" }}
    >
      <div className="w-60 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Filter className="h-4 w-4" /> {t("orders.filters.title")}
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-primary text-white text-[10px] px-1.5 py-0.5 font-medium">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={reset}
              className="h-7 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3" />{" "}
              {t("orders.filters.resetButton")}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggle}
              className="h-7 w-7 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Selector
            label={t("orders.filters.workSite")}
            value={filters.WorkSiteId}
            setValue={(value) =>
              onChange({
                ...filters,
                WorkSiteId: value || undefined,
              })
            }
            className="w-full text-sm font-medium bg-white border-none focus:outline-none"
          >
            {workSites.map((ws) => (
              <option key={ws.id} value={ws.id} className="">
                {ws.name}
              </option>
            ))}
          </Selector>

          <div className="space-y-2">
            <Input
              label={t("orders.filters.search.label")}
              value={filters.SearchByOwner ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  SearchByOwner: e.target.value || undefined,
                })
              }
              placeholder={t("orders.filters.search.placeholder")}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("orders.filters.status.label")}
            </Label>
            <div className="space-y-2">
              {ORDER_STATUSES.map((s) => {
                const checked = filters.Status?.startsWith(s) ?? false;
                return (
                  <label
                    key={s}
                    onClick={() =>
                      onChange({
                        ...filters,
                        Status: s,
                      })
                    }
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                  >
                    <Checkbox checked={checked} />
                    {t(`orders.filters.status.${s}`)}
                  </label>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("orders.filters.dateRange.label")}
            </Label>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Input
                  type="date"
                  label={t("orders.filters.dateRange.from")}
                  value={filters?.From?.toISOString().slice(0, 10) ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      From: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type="date"
                  label={t("orders.filters.dateRange.to")}
                  value={filters?.To?.toISOString().slice(0, 10) ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      To: new Date(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
