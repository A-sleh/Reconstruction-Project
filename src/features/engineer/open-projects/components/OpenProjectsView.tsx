import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useOpenProjects } from "../api/queries";
import type { OpenProject, OpenProjectsFilters } from "../api/types";
import type { SectionKey } from "../constants";
import {
  CLOSING_SOON_WINDOW_DAYS,
  isWithinDays,
  daysSince,
  LATEST_POSTED_WINDOW_DAYS,
} from "../constants";
import OpenProjectsSections from "./OpenProjectsSections";
import OpenProjectsFiltersPanel from "./OpenProjectsFilters";
import OpenProjectCard from "./OpenProjectCard";
import OpenProjectDetailsDrawer from "./OpenProjectDetailsDrawer";
import ApplyProjectModal from "./ApplyProjectModal";

export default function OpenProjectsView() {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useOpenProjects();

  const [query, setQuery] = useState("");
  const [section, setSection] = useState<SectionKey>("all");
  const [filters, setFilters] = useState<OpenProjectsFilters>({});
  const [selectedProject, setSelectedProject] = useState<OpenProject | null>(
    null,
  );
  const [applyProject, setApplyProject] = useState<OpenProject | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

  const handleApply = useCallback(
    (project: OpenProject) => {
      setApplyProject(project);
      setSelectedProject(null);
    },
    [],
  );

  const handleApplySuccess = useCallback(() => {
    if (applyProject) {
      setAppliedIds((prev) => new Set(prev).add(applyProject.id));
    }
    setApplyProject(null);
  }, [applyProject]);

  const filtered = useMemo(() => {
    if (!projects) return [];

    let result: OpenProject[] = [...(projects ?? [])];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.overview.toLowerCase().includes(q),
      );
    }

    if (filters.Specialties && filters.Specialties.length > 0) {
      const req = filters.Specialties;
      result = result.filter((p) =>
        req.some((s) => p.requiredSpecialties.includes(s)),
      );
    }

    if (filters.Scale) {
      result = result.filter((p) => p.scale === filters.Scale);
    }

    if (filters.MinDurationWeeks) {
      result = result.filter(
        (p) => p.durationWeeks >= (filters.MinDurationWeeks ?? 0),
      );
    }

    if (filters.MaxDurationWeeks) {
      result = result.filter(
        (p) => p.durationWeeks <= (filters.MaxDurationWeeks ?? 104),
      );
    }

    if (filters.DeadlineWithinDays && filters.DeadlineWithinDays > 0) {
      result = result.filter((p) =>
        isWithinDays(p.applicationDeadline, filters.DeadlineWithinDays!),
      );
    }

    switch (section) {
      case "latest":
        result = result
          .filter((p) => daysSince(p.postedAt) <= LATEST_POSTED_WINDOW_DAYS)
          .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case "closing-soon":
        result = result
          .filter(
            (p) =>
              p.status === "ClosingSoon" ||
              isWithinDays(p.applicationDeadline, CLOSING_SOON_WINDOW_DAYS),
          )
          .sort(
            (a, b) =>
              new Date(a.applicationDeadline).getTime() -
              new Date(b.applicationDeadline).getTime(),
          );
        break;
      case "enterprise":
        result = result.filter((p) => p.scale === "Enterprise");
        break;
      case "mid":
        result = result.filter((p) => p.scale === "Mid" || p.scale === "Small");
        break;
      default:
        result.sort(
          (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
        );
    }

    return result;
  }, [projects, query, section, filters]);

  const resetFilters = () => {
    setQuery("");
    setFilters({});
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("openProjects.header.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("openProjects.header.subtitle")}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          {t("openProjects.header.count", { count: filtered.length })}
        </span>
      </div>

      <OpenProjectsSections value={section} onValueChange={setSection} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <OpenProjectsFiltersPanel
            filters={filters}
            onUpdate={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onReset={resetFilters}
          />
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[420px] animate-pulse rounded-xl border border-gray-200 bg-muted/30"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/30 py-20 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {t("openProjects.empty")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(i * 0.06, 0.3),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <OpenProjectCard
                    project={project}
                    onOpen={() => setSelectedProject(project)}
                    applied={appliedIds.has(project.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <OpenProjectDetailsDrawer
        project={selectedProject}
        applied={selectedProject ? appliedIds.has(selectedProject.id) : false}
        onClose={() => setSelectedProject(null)}
        onApply={handleApply}
      />

      <ApplyProjectModal
        project={applyProject}
        open={applyProject !== null}
        onClose={handleApplySuccess}
      />
    </div>
  );
}
