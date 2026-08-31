import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import { usePublicProviderProfile } from "@/features/public-provider/api/queries";
import ContactForm from "@/features/public-provider/components/ContactForm";
import InventoryCatalog from "@/features/public-provider/components/InventoryCatalog";
import ProviderHero from "@/features/public-provider/components/ProviderHero";
import ProviderStats from "@/features/public-provider/components/ProviderStats";
import ReviewsSection from "@/features/public-provider/components/ReviewsSection";
import WorkSitesGallery from "@/features/public-provider/components/WorkSitesGallery";
import { mockProviderProfile } from "@/features/public-provider/mockData";

export default function PublicProviderProfile() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { id = "" } = useParams();

  const { data: provider1, isLoading } = usePublicProviderProfile(id);

  if (isLoading) return <Loader />;

  // if (!provider)
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gray-50">
  //       <p className="text-muted-foreground">
  //         {isArabic ? "المزوّد غير موجود" : "Provider not found"}
  //       </p>
  //     </div>
  //   );

  const provider = mockProviderProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderHero provider={provider} />

      <main
        className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <ProviderStats provider={provider} />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {t("publicProvider.workSites.title")}
          </h2>
          <WorkSitesGallery workSites={provider.workSites ?? []} />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {t("publicProvider.inventory.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("publicProvider.inventory.subtitle")}
            </p>
          </div>
          <InventoryCatalog inventory={provider.inventory ?? []} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {t("publicProvider.reviews.title")}
          </h2>
          <ReviewsSection provider={provider} />
        </section>

        <section id="public-contact" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {t("publicProvider.contact.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("publicProvider.contact.subtitle")}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <ContactForm providerName={provider.name} />
          </div>
        </section>
      </main>
    </div>
  );
}
