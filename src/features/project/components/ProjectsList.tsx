import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import { useProjectsInfinite } from "../api/queries";
import type { GetAllProjectsFilters } from "../api/types";
import SummeryProjectCard from "./SummeryProjectCard";
import { Skeleton } from "@/components/ui/Skeleton";

const ProjectsList = ({ filters }: { filters: GetAllProjectsFilters }) => {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProjectsInfinite(filters);

  const projects = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full space-y-4">
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="rounded-lg border border-gray-300 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-gray-300 bg-white py-16 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">
            {t("project.list.empty")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("project.list.emptyHint")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <SummeryProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div ref={sentinelRef} className="h-8" />

          {isFetchingNextPage && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`nx-${i}`}
                  className="rounded-lg border border-gray-300 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!hasNextPage && projects.length > 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              {t("project.list.endOfList")}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsList;
