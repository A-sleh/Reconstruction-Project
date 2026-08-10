import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EngineerProject,
  EngineerProjectStatus,
} from "../api/types";
import LastProjectCard from "./LastProjectCard";

interface Props {
  projects: EngineerProject[];
}

const statusOptions: EngineerProjectStatus[] = [
  "COMPLETED",
  "IN_PROGRESS",
  "PLANNING",
];

const PortfolioList = ({ projects }: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        search === "" ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.category.toLowerCase().includes(search.toLowerCase()) ||
        project.client.toLowerCase().includes(search.toLowerCase()) ||
        project.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t("engineerProfile.projects.portfolio.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.projects.portfolio.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap md:flex-nowrap">
          <div className="relative w-full md:w-64">
            <Search
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                isArabic ? "right-3" : "left-3",
              )}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "engineerProfile.projects.portfolio.searchPlaceholder",
              )}
              className={cn(isArabic ? "pr-9" : "pl-9")}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue
                placeholder={t(
                  "engineerProfile.projects.portfolio.allStatuses",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("engineerProfile.projects.portfolio.allStatuses")}
              </SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(`engineerProfile.projects.status.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <LastProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-300 bg-white shadow-card p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted text-muted-foreground grid place-items-center">
            <FolderOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">
            {t("engineerProfile.projects.portfolio.empty")}
          </h3>
        </div>
      )}
    </section>
  );
};

export default PortfolioList;
