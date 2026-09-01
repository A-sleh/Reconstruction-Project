import { BriefcaseBusiness, CheckCircle2, Construction, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface Props {
  totalProjects: number;
  completed: number;
  inProgress: number;
  yearsExperience: number;
}

const PortfolioStats = ({
  totalProjects,
  completed,
  inProgress,
  yearsExperience,
}: Props) => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: FolderOpen,
      accent: "bg-primary/10 text-primary",
      label: t("engineerProfile.stats.totalProjects"),
      value: totalProjects,
    },
    {
      icon: CheckCircle2,
      accent: "bg-emerald-500/10 text-emerald-600",
      label: t("engineerProfile.stats.completed"),
      value: completed,
    },
    {
      icon: Construction,
      accent: "bg-amber-500/10 text-amber-600",
      label: t("engineerProfile.stats.inProgress"),
      value: inProgress,
    },
    {
      icon: BriefcaseBusiness,
      accent: "bg-indigo-500/10 text-indigo-600",
      label: t("engineerProfile.stats.yearsExperience"),
      value: yearsExperience,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PortfolioStats;
