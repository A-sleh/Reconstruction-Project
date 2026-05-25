import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { paths } from "@/config/paths";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceHeader from "@/features/resource-providor/site-resources/components/ResourceHeader";
import InventoryTab from "@/features/resource-providor/site-resources/components/InventoryTab";
import OrdersTab from "@/features/resource-providor/site-resources/components/OrdersTab";
import {
  useResorceOrders,
  useResources,
} from "@/features/resource-providor/site-resources/api/query";
import Loader from "@/components/shared/Loader";

const WorkSiteDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  const { siteId = "" } = useParams();
  const { data: site, isPending: resourceIsFetching } = useResources(siteId);
  const { data: orders, isPending: orderIsFetching } = useResorceOrders();

  if (resourceIsFetching || orderIsFetching) return <Loader />;

  const resources = site?.resources || [];

  if (!site) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">
            {t("resourceProvidor.workSites.site-not-found")}
          </p>
          <Link to={paths.app.resourceProvidor.workSites.path} className="mt-4">
            {t("resourceProvidor.workSites.back-to-sites")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ResourceHeader site={site} />

      <section className="container py-8">
        <Tabs
          defaultValue="inventory"
          className="w-full"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <TabsList dir={isArabic ? "rtl" : "ltr"}>
            <TabsTrigger value="inventory">
              {t("resourceProvidor.workSites.tabs.inventory_count", {
                count: resources.length,
              })}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {t("resourceProvidor.workSites.tabs.orders_count", {
                count: orders?.length,
              })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            <InventoryTab resources={resources} />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <OrdersTab orders={orders || []} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default WorkSiteDetails;
