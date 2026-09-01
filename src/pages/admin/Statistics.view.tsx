import BankRequestsTrend from "@/features/admin-statistics/components/BankRequestsTrend";
import CategoryHealthBar from "@/features/admin-statistics/components/CategoryHealthBar";
import Header from "@/features/admin-statistics/components/Header";
import PlatformKPISection from "@/features/admin-statistics/components/PlatformKPISection";
import RecentActivityCard from "@/features/admin-statistics/components/RecentActivityCard";
import RequestStatusBreakdown from "@/features/admin-statistics/components/RequestStatusBreakdown";
import SupportStatusPie from "@/features/admin-statistics/components/SupportStatusPie";
import UserGrowthChart from "@/features/admin-statistics/components/UserGrowthChart";
import UserRolesPieChart from "@/features/admin-statistics/components/UserRolesPieChart";
import { useBankStat } from "@/features/category-bank/api/quertes";
import { useSystemUserStats } from "@/features/system-users/api/query";

const supportStats = {
  open_tickets: 12,
  pending_customer: 5,
  urgent_tickets: 3,
  resolved_today: 8,
};

export default function Statistics() {
  const { data: userStats } = useSystemUserStats();
  const { data: bankStat } = useBankStat();

  return (
    <div className="min-h-screen bg-background pb-8">
      <main className="container space-y-8">
        <Header />

        <PlatformKPISection />

        {/* Row 1: User distribution */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UserRolesPieChart
            investors={userStats?.investors ?? 0}
            resourceProviders={userStats?.resourceProviders ?? 0}
            serviceProviders={userStats?.serviceProviders ?? 0}
            engineers={userStats?.engineers ?? 0}
          />
          <UserGrowthChart />
        </div>

        {/* Row 2: System health */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryHealthBar
            resourceCategories={bankStat?.totalResourcesBank ?? 0}
            serviceCategories={bankStat?.totalServicesBank ?? 0}
          />
          <SupportStatusPie
            open={supportStats.open_tickets}
            inProgress={0}
            pendingCustomer={supportStats.pending_customer}
            resolved={supportStats.resolved_today}
            closed={0}
          />
        </div>

        {/* Row 3: Platform activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <BankRequestsTrend />
          <RequestStatusBreakdown
            accepted={0}
            pending={bankStat?.totalUpcomingRequest ?? 0}
            rejected={0}
            resolved={0}
          />
        </div>

        {/* Row 4: Recent activity */}
        <RecentActivityCard />
      </main>
    </div>
  );
}
