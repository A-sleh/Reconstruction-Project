import WorkSiteHeader from "@/features/resource-providor/work-sites/components/WorkStieHeader";
import WorkSitesSection from "@/features/resource-providor/work-sites/components/WorkSitesSection";

const WorkSites = () => {
  return (
    <div className="min-h-screen w-full">
      <section className="rounded-lg bg-white">
        <WorkSiteHeader />
      </section>
      <WorkSitesSection />
    </div>
  );
};

export default WorkSites;
