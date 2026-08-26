import EmptyState from "@/components/common/EmptyState";
import { HardHat, Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { GetAllWorkShopsFilters } from "../api/types";
import { MOCK_WORK_SHOPS } from "../mock/mockWorkShops";
import WorkShopCard from "./WorkShopCard";
import WorkShopFilters from "./WorkShopFilters";
import WorkShopModel from "./WorkShopModel";

const WorkShops = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetAllWorkShopsFilters>({});

  const workShops = useMemo(() => {
    return MOCK_WORK_SHOPS.filter((w) => {
      const matchesSearch =
        !filters.Search ||
        w.title.toLowerCase().includes(filters.Search.toLowerCase()) ||
        w.description.toLowerCase().includes(filters.Search.toLowerCase());
      const created = new Date(w.createdAt).getTime();
      const matchesFrom =
        !filters.fromDate || created >= new Date(filters.fromDate).getTime();
      const matchesTo =
        !filters.toDate ||
        created <= new Date(filters.toDate).getTime() + 86_399_000;
      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [filters]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 ">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t("workShops.header.title", "Workshops")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "workShops.header.subTitle",
                "Manage and monitor all active workshops.",
              )}
            </p>
          </div>
        </div>
        <WorkShopModel openKey="create-work-shop" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2">
          <WorkShopFilters filters={filters} onChange={setFilters} />
        </div>
        <div className="space-y-5 lg:order-1">
          <div className="grid gap-5 sm:grid-cols-2 ">
            {workShops.length === 0 ? (
              <div className="sm:col-span-2 xl:col-span-3">
                <EmptyState
                  icon={Inbox}
                  message={t(
                    "workShops.empty",
                    "No workshops match your filters.",
                  )}
                />
              </div>
            ) : (
              workShops.map((workShop, index) => (
                <WorkShopCard
                  key={workShop.id}
                  workShop={workShop}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkShops;
