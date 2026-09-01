import { useEngineerStatistics } from "@/features/engineer/statistics/api/queries";
import { mockEngineerStatistics } from "@/features/engineer/statistics/mockData";
import StatisticsHeader from "@/features/engineer/statistics/components/StatisticsHeader";
import EngineerKpiSection from "@/features/engineer/statistics/components/EngineerKpiSection";
import ProjectStatusDonut from "@/features/engineer/statistics/components/ProjectStatusDonut";
import ProjectsTrendChart from "@/features/engineer/statistics/components/ProjectsTrendChart";
import BudgetByCategoryChart from "@/features/engineer/statistics/components/BudgetByCategoryChart";
import UpcomingDeadlines from "@/features/engineer/statistics/components/UpcomingDeadlines";
import ReviewsSummary from "@/features/engineer/statistics/components/ReviewsSummary";
import ExperienceTimeline from "@/features/engineer/statistics/components/ExperienceTimeline";

const EngineerStatistics = () => {
  const { data } = useEngineerStatistics();
  const stats = data ?? mockEngineerStatistics;

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="container space-y-6 py-6 md:space-y-8 md:py-8">
        <StatisticsHeader />
        <EngineerKpiSection stats={stats} />
        <div className="grid gap-6 lg:grid-cols-2">
          <ProjectsTrendChart stats={stats} />
          <ProjectStatusDonut stats={stats} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <BudgetByCategoryChart stats={stats} />
          <UpcomingDeadlines stats={stats} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ReviewsSummary stats={stats} />
          <ExperienceTimeline stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default EngineerStatistics;