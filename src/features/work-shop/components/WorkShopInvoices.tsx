import { useMemo, useState } from "react";
import type { GetAllInvoicesFilters } from "../api/types";
import { MOCK_WORK_SHOP_INVOICES } from "../mock/mockInvoices";
import InvoiceFilters from "./InvoiceFilters";
import InvoicesTable from "./InvoicesTable";

const WorkShopInvoices = () => {
  const [filters, setFilters] = useState<GetAllInvoicesFilters>({});

  const invoices = useMemo(() => {
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;
    if (to) to.setHours(23, 59, 59, 999);

    return MOCK_WORK_SHOP_INVOICES.filter((invoice) => {
      const date = new Date(invoice.date).getTime();
      if (from && date < from.getTime()) return false;
      if (to && date > to.getTime()) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <InvoicesTable invoices={invoices} />
      <InvoiceFilters filters={filters} onChange={setFilters} />
    </div>
  );
};

export default WorkShopInvoices;
