//! ToDo: This needed to refelect the service providor

import { useMemo } from "react";

import Header from "@/features/resource-providor/statistics/components/Header";
import KPISection from "@/features/resource-providor/statistics/components/KPISection";
import {
  useResourcesStat,
  useRequestsStat,
  useSitesStat,
} from "@/features/resource-providor/statistics/api/query";
import SitesRankingBarChart from "@/features/resource-providor/statistics/components/SitesRankingBarChart";
import InvestorRequestPieChart from "@/features/resource-providor/statistics/components/InvestorRequestPieChart";
import SiteStatusProgressBar from "@/features/resource-providor/statistics/components/SiteStatusProgressBar";
import SiteOperationalStatus from "@/features/resource-providor/statistics/components/SiteOperationalStatus";
import { useOrdersInfinite } from "@/features/orders/api/query";
import Loader from "@/components/shared/Loader";

export default function Statistics() {
  const { data: sitesStat, isLoading: loadingSites } = useSitesStat();
  const { data: resourcesStat, isLoading: loadingResources } =
    useResourcesStat();
  const { data: requestsStat, isLoading: loadingRequests } = useRequestsStat();
  const { data: ordersRes, isLoading: loadingOrders } = useOrdersInfinite({
    PageSize: 200,
  });

  const sites = sitesStat ?? [];
  const resources = resourcesStat ?? [];
  const requests = requestsStat ?? [];
  const orders = useMemo(
    () => ordersRes?.pages?.flatMap((p) => p.data) ?? [],
    [ordersRes],
  );

  const isLoading =
    loadingSites || loadingResources || loadingRequests || loadingOrders;

  const stats = useMemo(() => {
    const avgProgress = sites.length
      ? Math.round(sites.reduce((s, x) => s + x.progress, 0) / sites.length)
      : 0;

    const siteStatus = (["active", "on-hold", "completed"] as const).map(
      (k) => ({
        name: k,
        value: sites.filter((s) => s.status === k).length,
      }),
    );

    const categoryMap = new Map<string, number>();
    resources.forEach((r) => {
      categoryMap.set(
        r.category,
        (categoryMap.get(r.category) ?? 0) + r.pricePerUnit * r.quantity,
      );
    });
    const byCategory = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);

    const siteValue = sites
      .map((s) => ({
        name: s.name.length > 16 ? s.name.slice(0, 14) + "…" : s.name,
        value: Math.round(
          resources
            .filter((r) => r.siteId === s.id)
            .reduce((a, r) => a + r.pricePerUnit * r.quantity, 0),
        ),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return {
      avgProgress,
      siteStatus,
      byCategory,
      siteValue,
    };
  }, [sites, resources]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background pb-8">
      <main className="container space-y-8">
        <Header />
        <KPISection
          sites={sites.length}
          avgProgress={stats.avgProgress}
          orders={orders}
          resources={resources}
        />

        {/* Charts row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <InvestorRequestPieChart requests={requests} />
          <SitesRankingBarChart siteValue={stats.siteValue} />
        </div>

        {/* Charts row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SiteStatusProgressBar
            avgProgress={stats.avgProgress}
            siteStatus={stats.siteStatus}
            totoalSites={sites?.length ?? 0}
          />
          <SiteOperationalStatus byCategory={stats.byCategory} />
        </div>
      </main>
    </div>
  );
}
