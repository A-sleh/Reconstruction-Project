import type { GetAllProjectsFilters } from "@/features/project/api/types";
import ProjectFilters from "@/features/project/components/ProjectFilters";
import ProjectHeaderPage from "@/features/project/components/ProjectHeaderPage";
import ProjectsList from "@/features/project/components/ProjectsList";
import { useState } from "react";

const Pojects = () => {
  const [filters, setFilters] = useState<GetAllProjectsFilters>({});

  return (
    <div>
      <ProjectHeaderPage />
      <div className="grid gap-3 md:grid-cols-[1fr_260px] mt-4 items-start">
        <section className="min-w-0">
          <ProjectsList filters={filters} />
        </section>
        <section className="sticky top-25">
          <ProjectFilters filters={filters} onChange={setFilters} />
        </section>
      </div>
    </div>
  );
};

export default Pojects;
