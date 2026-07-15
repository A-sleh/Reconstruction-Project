import { useState } from "react";
import { OrdersFilterSidebar } from "@/features/orders/components/OrderFiltersSideBar";
import { GetOrderAllFilters } from "@/features/orders/api/types";
import OrderHeader from "@/features/orders/components/OrderHeader";
import OrderTable from "@/features/orders/components/OrderTables";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetOrderAllFilters>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <OrdersFilterSidebar
          filters={filters}
          onChange={setFilters}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 min-w-0">
          <section className="container mx-4">
            <OrderHeader
              description={t("orders.headerDescriptionForServiceProvider")}
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
            />
            <OrderTable filters={filters} />
          </section>
        </main>
      </div>
    </div>
  );
}
