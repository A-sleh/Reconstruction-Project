import WorkSiteHeader from "@/features/resource-providor/work-sites/components/WorkStieHeader";
import WorkSitesSection from "@/features/resource-providor/work-sites/components/WorkSitesSection";

const WorkSites = () => {
  return (
    <div className="min-h-screen">
      <section className="border-b border-gray-300 bg-linear-to-br from-background via-background to-muted/40">
        <WorkSiteHeader />
      </section>
      <WorkSitesSection />
    </div>
  );
};

export default WorkSites;
