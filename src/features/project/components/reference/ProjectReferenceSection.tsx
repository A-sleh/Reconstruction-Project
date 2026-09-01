import { useLandById } from "@/features/investor/lands-buildings/api/query";
import type { LatLng } from "@/lib/helpers";

import type { ProjectDetails } from "../../api/types";
import BuildingInfoCard from "./BuildingInfoCard";
import LandInfoCard from "./LandInfoCard";
import ProjectInfoCard from "./ProjectInfoCard";
import ProjectMapCard from "./ProjectMapCard";
import ProjectStatsStrip from "./ProjectStatsStrip";

const ProjectReferenceSection = ({ project }: { project: ProjectDetails }) => {
  const landId = project.building?.land?.id;
  const { data: land, isLoading: landIsLoading } = useLandById(
    landId && landId > 0 ? landId : 0,
  );

  const polygon: LatLng[] = (
    land?.border ??
    project.building?.border ??
    []
  ).map((b) => ({ lat: b.latitude, lng: b.longitude }));

  return (
    <div className="space-y-6">
      <ProjectInfoCard project={project} />
      <ProjectStatsStrip statistics={project.statistics} />
      <div className="grid gap-6 lg:grid-cols-2">
        <BuildingInfoCard building={project.building} />
        <LandInfoCard land={land} isLoading={landIsLoading} />
      </div>
      <ProjectMapCard location={project.building?.location} polygon={polygon} />
    </div>
  );
};

export default ProjectReferenceSection;
