import { ArrowLeft, ClipboardList, History, Receipt } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { paths } from "@/config/paths";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFetchRequestDetails } from "@/features/resource-providor/order-details/api/query";
import OrderDetailsHeader from "@/features/resource-providor/order-details/components/OrderDetailsHeader";
import MarkFullyDelivered from "@/features/resource-providor/order-details/components/MarkFullyDelivered";
import ResourcesTable from "@/features/resource-providor/order-details/components/ResourcesTable";
import FinancialSection from "@/features/resource-providor/order-details/components/FinancialSection";
import HistorySection from "@/features/resource-providor/order-details/components/HistorySection";
import Loader from "@/components/shared/Loader";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { orderId = "" } = useParams();
  const { data: request, isPending } = useFetchRequestDetails(orderId);
  const isArabic = i18n.language === "ar";

  if (isPending) return <Loader />;

  if (!request) {
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

  const total = request.resources.reduce((s, x) => s + x.quantity, 0);
  const delivered = request.resources.reduce((s, x) => s + x.delivered, 0);
  const fullyDelivered = total > 0 && delivered >= total;
  const totalInvoiced = request.invoices.reduce((s, x) => s + x.amount, 0);

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
            <OrderDetailsHeader requestDetails={request} />
          </div>
        </section>

        <MarkFullyDelivered
          delivered={delivered}
          fullyDelivered={fullyDelivered}
          id={request?.id}
          status={request.status}
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
            <ResourcesTable resources={request.resources} />
          </TabsContent>

          <TabsContent value="financials">
            <FinancialSection
              invoices={request.invoices}
              totalInvoiced={totalInvoiced}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistorySection history={request.history} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
