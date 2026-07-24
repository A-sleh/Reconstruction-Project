import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankCategoryKPISection from "@/features/category-bank/components/BankCategoryKPISection";
import SystemCategories from "@/features/category-bank/components/SystemCateogries";
import BankItemsRequests from "@/features/category-bank/components/BankItemsRequests";

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
            <TabsTrigger value="all">
              {t("categoryBank.tabs.allCategories")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <BankItemsRequests />
          </TabsContent>
          <TabsContent value="all" className="mt-6">
            <SystemCategories />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Categories;
