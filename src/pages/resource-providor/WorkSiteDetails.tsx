import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceHeader from "@/features/resource-providor/site-resources/components/ResourceHeader";
import InventoryTab from "@/features/resource-providor/site-resources/components/InventoryTab";
import OrdersTab from "@/features/resource-providor/site-resources/components/OrdersTab";

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
              {t("resourceProvidor.workSites.tabs.inventory_count")}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {t("resourceProvidor.workSites.tabs.orders_count")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            <InventoryTab />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <OrdersTab orders={[]} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default WorkSiteDetails;
