import { useMemo, useState } from "react";

import { HardHat, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import EmptyState from "@/components/common/EmptyState";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/Skeleton";

import { useWorkShopsInfinite } from "../api/queries";
import type { GetAllWorkShopsFilters } from "../api/types";
import WorkShopCard from "./WorkShopCard";
import WorkShopFilters from "./WorkShopFilters";
import WorkShopModel from "./WorkShopModel";

const SKELETON_CARDS = 6;

const WorkShops = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId?: string }>();
  const [filters, setFilters] = useState<GetAllWorkShopsFilters>({});

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useWorkShopsInfinite({
      ProjectId: projectId ? Number(projectId) : undefined,
    });

  const pages = data?.pages ?? [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loaded = pages.flatMap((p) => p.data) ?? [];
  const totalRows = pages[pages.length - 1]?.totalRows ?? loaded.length;

  const workShops = useMemo(() => {
    return loaded.filter((w) => {
      const matchesSearch =
        !filters.Search ||
        w.name.toLowerCase().includes(filters.Search.toLowerCase()) ||
        w.description.toLowerCase().includes(filters.Search.toLowerCase());
      const created = new Date(w.startWorkDate).getTime();
      const matchesFrom =
        !filters.fromDate || created >= new Date(filters.fromDate).getTime();
      const matchesTo =
        !filters.toDate ||
        created <= new Date(filters.toDate).getTime() + 86_399_000;
      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [filters, loaded]);

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

      <p className="text-sm text-muted-foreground">
        {t("workShops.header.count", "{{count}} workshops", {
          count: totalRows,
        })}
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2">
          <WorkShopFilters filters={filters} onChange={setFilters} />
        </div>
        <div className="space-y-5 lg:order-1">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="space-y-3 p-0 pt-0">
                    <Skeleton className="h-40 w-full" />
                    <div className="space-y-3 p-4">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : workShops.length === 0 ? (
            <EmptyState
              icon={Inbox}
              message={t("workShops.empty", "No workshops match your filters.")}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {workShops.map((workShop, index) => (
                <WorkShopCard
                  key={workShop.id}
                  workShop={workShop}
                  index={index}
                />
              ))}
            </div>
          )}

          <LoadMoreButton
            onLoadMore={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            hasMore={!!hasNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkShops;
