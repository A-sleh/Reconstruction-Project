import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HardHat, ReceiptText } from "lucide-react";
import { useTranslation } from "react-i18next";
import WorkShopInvoices from "@/features/work-shop/components/WorkShopInvoices";
import WorkShops from "@/features/work-shop/components/WorkShops";

const ManageWorkShopPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <Tabs
        defaultValue="workshops"
        className="mt-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <TabsList className="mb-1" dir={isArabic ? "rtl" : "ltr"}>
          <TabsTrigger value="workshops">
            <HardHat className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("workShops.tabs.workshops", "Workshops")}
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <ReceiptText className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("workShops.tabs.invoices", "Invoices")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workshops">
          <WorkShops />
        </TabsContent>

        <TabsContent value="invoices">
          <WorkShopInvoices />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageWorkShopPage;
