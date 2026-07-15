import WorkSiteHeader from "@/features/work-sites/components/WorkStieHeader";
import WorkSitesSection from "@/features/work-sites/components/WorkSitesSection";
import { useTranslation } from "react-i18next";

const WorkSites = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full">
      <section className="rounded-lg bg-white">
        <WorkSiteHeader description={t("serviceProvider.workSite.workSitesDescOfHeader")} />
      </section>
      <WorkSitesSection />
    </div>
  );
};

export default WorkSites;
