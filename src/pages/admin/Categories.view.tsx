import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankCategoryKPISection from "@/features/category-bank/components/BankCategoryKPISection";
import BankItemsRequests from "@/features/category-bank/components/BankItemsRequests";
import SystemResources from "@/features/category-bank/components/SystemResources";
import SystemServices from "@/features/category-bank/components/SystemServices";

const Categories = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-8 space-y-8">
        <BankCategoryKPISection
          totalCategories={12}
          pendingRequests={6}
          totalResources={45}
          serviceCategories={8}
        />

        <Tabs
          defaultValue="pending"
          className="w-full"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <TabsList dir={isArabic ? "rtl" : "ltr"}>
            <TabsTrigger value="pending">
              {t("categoryBank.tabs.pendingRequests")}
            </TabsTrigger>
            <TabsTrigger value="allResources">
              {t("categoryBank.tabs.allResources")}
            </TabsTrigger>
            <TabsTrigger value="allServices">
              {t("categoryBank.tabs.allServices")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <BankItemsRequests />
          </TabsContent>
          <TabsContent value="allResources" className="mt-6">
            <SystemResources />
          </TabsContent>
          <TabsContent value="allServices" className="mt-6">
            <SystemServices />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Categories;
