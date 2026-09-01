import {
  BriefcaseBusiness,
  CheckCircle2,
  Construction,
  FolderOpen,
  Inbox,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import KpiCard from "@/components/shared/KpiCard";
import type { EngineerStatistics } from "../api/types";

interface EngineerKpiSectionProps {
  stats: EngineerStatistics;
}

const EngineerKpiSection = ({ stats }: EngineerKpiSectionProps) => {
  const { t } = useTranslation();
  const kpi = stats.kpi;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <KpiCard
        icon={FolderOpen}
        label={t("engineerStatistics.kpi.totalProjects")}
        value={kpi.totalProjects.toLocaleString()}
        hint={t("engineerStatistics.kpi.totalProjectsHint")}
        accent="bg-primary/10 text-primary"
      />
      <KpiCard
        icon={CheckCircle2}
        label={t("engineerStatistics.kpi.completed")}
        value={kpi.completed.toLocaleString()}
        hint={t("engineerStatistics.kpi.completedHint")}
        accent="bg-emerald/10 text-emerald"
      />
      <KpiCard
        icon={Construction}
        label={t("engineerStatistics.kpi.inProgress")}
        value={kpi.inProgress.toLocaleString()}
        hint={t("engineerStatistics.kpi.inProgressHint")}
        accent="bg-gold/10 text-gold"
      />
      <KpiCard
        icon={BriefcaseBusiness}
        label={t("engineerStatistics.kpi.yearsExperience")}
        value={kpi.yearsOfExperience.toLocaleString()}
        hint={t("engineerStatistics.kpi.yearsExperienceHint")}
        accent="bg-slate/10 text-slate"
      />
      <KpiCard
        icon={Star}
        label={t("engineerStatistics.kpi.rating")}
        value={kpi.rating.toFixed(1)}
        hint={t("engineerStatistics.kpi.ratingHint", { count: kpi.reviewsCount })}
        accent="bg-gold/10 text-gold"
      />
      <KpiCard
        icon={Inbox}
        label={t("engineerStatistics.kpi.pendingInvites")}
        value={kpi.pendingInvites.toLocaleString()}
        hint={t("engineerStatistics.kpi.pendingInvitesHint")}
        accent="bg-destructive/10 text-destructive"
      />
    </div>
  );
};

export default EngineerKpiSection;
