import { GetOrderAllFilters } from "@/features/orders/api/types";
import { OrdersFilterSidebar } from "@/features/orders/components/OrderFiltersSideBar";
import OrderTables from "@/features/orders/components/OrderTables";
import { useState } from "react";

const ProjectOrdersTracker = () => {
  const [filters, setFilters] = useState<GetOrderAllFilters>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex gap-4">
      <main className="flex-2 min-w-0 -mt-6.25">
        <OrderTables filters={filters} />
      </main>
      <OrdersFilterSidebar
        filters={filters}
        onChange={setFilters}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />
    </div>
  );
};

export default ProjectOrdersTracker;
