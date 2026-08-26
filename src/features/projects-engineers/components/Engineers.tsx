import { useMemo, useState } from "react";

import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";

import type { GetAllEngineersFilters } from "../api/types";
import { MOCK_ENGINEERS } from "../mock/mockEngineers";
import EngineerSummeryCard from "./EngineerSummeryCard";
import SearchEngineersFilters from "./SearchEngineersFilters";

const Engineers = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetAllEngineersFilters>({});

  const engineers = useMemo(() => {
    return MOCK_ENGINEERS.filter((e) => {
      const matchesSearch =
        !filters.search ||
        e.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.spec.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.location.toLowerCase().includes(filters.search.toLowerCase());
      const matchesSpec = !filters.spec || e.spec === filters.spec;
      const matchesYears =
        !filters.yearsOfExperiance ||
        e.yearsOfExperiance >= filters.yearsOfExperiance;
      const matchesRate = !filters.rate || e.rate >= filters.rate;
      const matchesProjects =
        !filters.numberOfCompletedProjects ||
        e.numberOfCompletedProjects >= filters.numberOfCompletedProjects;
      const matchesAvailability =
        !filters.isAvilable || e.isAvilable === filters.isAvilable;

      return (
        matchesSearch &&
        matchesSpec &&
        matchesYears &&
        matchesRate &&
        matchesProjects &&
        matchesAvailability
      );
    });
  }, [filters]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2 ">
          <SearchEngineersFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="lg:order-1">
          {engineers.length === 0 ? (
            <EmptyState
              icon={Inbox}
              message={t(
                "projectsEngineers.empty",
                "No engineers match your filters.",
              )}
            />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {engineers.map((engineer, index) => (
                <EngineerSummeryCard
                  key={engineer.id}
                  engineer={engineer}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Engineers;
