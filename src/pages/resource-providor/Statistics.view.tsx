import { useMemo } from "react";

import Header from "@/features/resource-providor/statistics/components/Header";
import KPISection from "@/features/resource-providor/statistics/components/KPISection";
import {
  useOrderRequestsStat,
  useRequestsStat,
  useResourcesStat,
  useSitesStat,
} from "@/features/resource-providor/statistics/api/query";
import SitesRankingBarChart from "@/features/resource-providor/statistics/components/SitesRankingBarChart";
import InvestorRequestPieChart from "@/features/resource-providor/statistics/components/InvestorRequestPieChart";
import SiteStatusProgressBar from "@/features/resource-providor/statistics/components/SiteStatusProgressBar";
import SiteOperationalStatus from "@/features/resource-providor/statistics/components/SiteOperationalStatus";
import Loader from "@/components/shared/Loader";

export default function Statistics() {
  const { data: sitesStat, isLoading: loadingSites } = useSitesStat();
  const { data: resourcesStat, isLoading: loadingResources } =
    useResourcesStat();
  const { data: orderRequestsStat, isLoading: loadingOrders } =
    useOrderRequestsStat();
  const { data: requestsStat, isLoading: loadingRequests } = useRequestsStat();

  // 2. Standardize fallback values for early calculations
  const sites = sitesStat ?? [];
  const resources = resourcesStat ?? [];
  const orderRequests = orderRequestsStat ?? [];
  const requests = requestsStat ?? [];

  const isLoading =
    loadingSites || loadingResources || loadingOrders || loadingRequests;

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

    const requestStatus = (
      ["pending", "partial", "completed", "rejected"] as const
    ).map((k) => ({
      name: k,
      value: requests.filter((r) => r.status === k).length,
    }));

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
        value:
          100 +
          Math.round(
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
      requestStatus,
      byCategory,
      siteValue,
    };
  }, [sites, resources, orderRequests, requests]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background pb-8">
      <main className="container space-y-8">
        <Header />
        <KPISection
          requests={requests.length}
          resources={resources.length}
          sites={sites.length}
        />

        {/* Charts row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <InvestorRequestPieChart requestStatus={stats.requestStatus} />
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
