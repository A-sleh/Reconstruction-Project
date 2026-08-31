import { useMemo } from "react";

import Header from "@/features/resource-providor/statistics/components/Header";
import KPISection from "@/features/resource-providor/statistics/components/KPISection";
import SiteStatusProgressBar from "@/features/resource-providor/statistics/components/SiteStatusProgressBar";
import SiteOperationalStatus from "@/features/resource-providor/statistics/components/SiteOperationalStatus";
import OrderVolumeTrend from "@/features/resource-providor/statistics/components/OrderVolumeTrend";
import RevenueBySiteBarChart from "@/features/resource-providor/statistics/components/RevenueBySiteBarChart";
import InventoryHealthPie from "@/features/resource-providor/statistics/components/InventoryHealthPie";
import DeliveryPipelineChart from "@/features/resource-providor/statistics/components/DeliveryPipelineChart";
import SitesByTypePie from "@/features/resource-providor/statistics/components/SitesByTypePie";
import FulfillmentBySiteBar from "@/features/resource-providor/statistics/components/FulfillmentBySiteBar";
import {
  MOCK_ORDERS_STAT,
  MOCK_REQUESTS_STAT,
  MOCK_RESOURCE_PROVIDOR_STAT,
  MOCK_RESOURCES_STAT,
  MOCK_SITES_STAT,
  MOCK_WORK_SITES,
} from "@/features/resource-providor/statistics/mock/mockStatistics";

export default function Statistics() {
  const sites = MOCK_SITES_STAT;
  const resources = MOCK_RESOURCES_STAT;
  const requests = MOCK_REQUESTS_STAT;
  const orders = MOCK_ORDERS_STAT;
  const workSitesList = MOCK_WORK_SITES;
  const providerStat = MOCK_RESOURCE_PROVIDOR_STAT;

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

    return { avgProgress, siteStatus, byCategory, siteValue };
  }, [sites, resources]);

  return (
    <div className="min-h-screen bg-background pb-8">
      <main className="container space-y-8">
        <Header />

        {/* Section 1: KPI Cards */}
        <KPISection
          sites={sites.length}
          avgProgress={stats.avgProgress}
          orders={orders}
          resources={resources}
          stat={providerStat}
        />

        {/* Section 2: Revenue & Orders */}
        <div className="grid gap-6 lg:grid-cols-2">
          <OrderVolumeTrend orders={orders} />
          <RevenueBySiteBarChart orders={orders} sites={sites} />
        </div>

        {/* Section 3: Inventory & Delivery */}
        <div className="grid gap-6 lg:grid-cols-2">
          <InventoryHealthPie resources={resources} />
          <DeliveryPipelineChart requests={requests} />
        </div>

        {/* Section 4: Site Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SitesByTypePie sites={workSitesList} />
          <FulfillmentBySiteBar sites={sites} />
        </div>

        {/* Section 5: Existing detailed views */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SiteStatusProgressBar
            avgProgress={stats.avgProgress}
            siteStatus={stats.siteStatus}
            totoalSites={sites.length}
          />
          <SiteOperationalStatus byCategory={stats.byCategory} />
        </div>
      </main>
    </div>
  );
}
