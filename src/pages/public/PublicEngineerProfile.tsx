import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import { usePublicEngineerProfile } from "@/features/public-engineer/api/queries";
import ContactEngineer from "@/features/public-engineer/components/ContactEngineer";
import EngineerHero from "@/features/public-engineer/components/EngineerHero";
import EngineerProjects from "@/features/public-engineer/components/EngineerProjects";
import EngineerReviews from "@/features/public-engineer/components/EngineerReviews";
import EngineerStats from "@/features/public-engineer/components/EngineerStats";
import { mockPublicEngineerProfile } from "@/features/public-engineer/mockData";

export default function PublicEngineerProfile() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { id = "" } = useParams();

  const { isLoading } = usePublicEngineerProfile(id);

  if (isLoading) return <Loader />;

  const engineer = mockPublicEngineerProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <EngineerHero engineer={engineer} />

      <main
        className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <EngineerStats engineer={engineer} />

        <section className="space-y-4">
          <EngineerProjects engineer={engineer} />
        </section>

        <section className="space-y-4">
          <EngineerReviews engineer={engineer} />
        </section>

        <ContactEngineer engineer={engineer} />
      </main>
    </div>
  );
}
