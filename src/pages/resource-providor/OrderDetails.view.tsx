import { ArrowLeft, ClipboardList, History, Receipt } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { paths } from "@/config/paths";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MOCK_ORDER_DETAILS_RESPONSE } from "@/features/orders/data/mockOrders";
import OrderDetailsHeader from "@/features/orders/components/OrderDetailsHeader"; 
import MarkFullyDelivered from "@/features/orders/components/MarkFullyDelivered"; 
import ResourcesTable from "@/features/orders/components/ResourcesTable"; 
import FinancialSection from "@/features/orders/components/FinancialSection"; 
import HistorySection from "@/features/orders/components/HistorySection"; 

export default function OrderDetails() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const orderDetails = MOCK_ORDER_DETAILS_RESPONSE.orderDetails;

  if (!orderDetails) {
    return (
      <div
        className="min-h-screen bg-background"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">{t(`resourceProvidor.investor-request-details.not_found`)}</p>
          <Button className="mt-4" onClick={() => navigate("/investors")}>
            {t(`resourceProvidor.investor-request-details.back_to_requests`)}
          </Button>
        </div>
      </div>
    );
  }

  const total = orderDetails.items.reduce((s, x) => s + x.quantity, 0);
  const delivered = orderDetails.items.reduce((s, x) => s + x.fulfilledQuantity, 0);
  const fullyDelivered = total > 0 && delivered >= total;
  const totalInvoiced = orderDetails.netTotal;

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <section className="container">
        <section className="border-b border-gray-300 gradient-hero text-primary-foreground rounded-lg p-6">
          <div className="container py-10">
            <Link
              to={paths.app.resourceProvidor.orders.path}
              className="inline-flex items-center gap-2 text-sm text-white hover:text-white/80 transition-smooth"
            >
              <ArrowLeft
                className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`}
              />
              {t(`resourceProvidor.investor-request-details.back_to_requests`)}
            </Link>
            <OrderDetailsHeader orderDetails={orderDetails} />
          </div>
        </section>

        <MarkFullyDelivered
          delivered={delivered}
          fullyDelivered={fullyDelivered}
          id={orderDetails.id}
          status={orderDetails.status}
          total={total}
          totalInvoiced={totalInvoiced}
        />

        <Tabs defaultValue="resources" className="mt-6"  dir={isArabic ? "rtl" : "ltr"}>
          <TabsList className="mb-1"  dir={isArabic ? "rtl" : "ltr"}>
            <TabsTrigger value="resources">
              <ClipboardList
                className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`}
              />
              {t(`resourceProvidor.investor-request-details.tabs.resources`)}
            </TabsTrigger>
            <TabsTrigger value="financials">
              <Receipt className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
              {t(`resourceProvidor.investor-request-details.tabs.financials`)}
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
              {t(`resourceProvidor.investor-request-details.tabs.history`)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <ResourcesTable items={orderDetails.items} />
          </TabsContent>

          <TabsContent value="financials">
            <FinancialSection
              payments={orderDetails.orderPayments}
              totalPaid={totalInvoiced}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistorySection invoices={orderDetails.orderReceiveInvoices} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
