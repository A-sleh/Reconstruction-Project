import { useState } from "react";
import ProjectHeaderPage from "@/features/project/components/ProjectHeaderPage";
import ProjectsList from "@/features/project/components/ProjectsList";
import ProjectFilters from "@/features/project/components/ProjectFilters";
import type { GetAllProjectsFilters } from "@/features/project/api/types";

const Pojects = () => {
  const [filters, setFilters] = useState<GetAllProjectsFilters>({});

  return (
    <div>
      <ProjectHeaderPage />
      <div className="grid gap-3 md:grid-cols-[1fr_260px] mt-4 items-start">
        <section className="min-w-0">
          <ProjectsList filters={filters} />
        </section>
        <section>
          <ProjectFilters filters={filters} onChange={setFilters} />
        </section>
      </div>
    </div>
  );
};

export default Pojects;
