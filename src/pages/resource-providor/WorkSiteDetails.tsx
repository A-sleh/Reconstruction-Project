import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceHeader from "@/features/site-resources/components/ResourceHeader";
import InventoryTab from "@/features/site-resources/components/InventoryTab";
import BankItemsRequests from "@/features/category-bank/components/BankItemsRequests";

const WorkSiteDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <div className="min-h-screen bg-background">
      <ResourceHeader />

      <section className="container py-8">
        <Tabs
          defaultValue="inventory"
          className="w-full"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <TabsList dir={isArabic ? "rtl" : "ltr"}>
            <TabsTrigger value="inventory">
              {t("workSites.tabs.inventory_count")}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {t("workSites.tabs.orders_count")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            <InventoryTab />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <BankItemsRequests />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default WorkSiteDetails;
