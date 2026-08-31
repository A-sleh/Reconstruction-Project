import { useMemo } from "react";
import { Filter, Inbox } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { useOrderStatusStatistics } from "../api/query";

const OrderHeader = ({
  sidebarOpen,
  setSidebarOpen,
  description,
  title,
  selectedWorkSiteId,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  selectedWorkSiteId: number;
}) => {
  const { t } = useTranslation();
  const { data: stat } = useOrderStatusStatistics({
    WorkSiteId: selectedWorkSiteId,
  });

  const prefix = "resourceProvidor.investor-request.investor-header";

  const stats = useMemo(() => {
    const data = stat?.data ?? [];
    const find = (status: string) =>
      data.find((s) => s.status === status)?.count ?? 0;
    const total = data.reduce((sum, s) => sum + s.count, 0);

    return [
      {
        label: t(`${prefix}.stats.pending`),
        value: find("PendingApproval"),
      },
      {
        label: t(`${prefix}.stats.partial`),
        value: find("Preparing"),
      },
      {
        label: t(`${prefix}.stats.completed`),
        value: find("Completed"),
      },
      {
        label: t(`${prefix}.stats.total`),
        value: total,
      },
    ];
  }, [stat, t, prefix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-4 flex-wrap rounded-lg bg-white w-full px-5 py-3 lg:py-10"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Inbox className="h-3 w-3" /> {t(`${prefix}.badge`)}
        </div>
        <h1 className="mt-3 text-3xl lg:text-4xl font-bold">
          {title || t(`${prefix}.title`)}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {description || t(`${prefix}.description`)}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-gray-300 bg-primary px-4 py-3 text-center min-w-[88px]"
            >
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] uppercase text-white/90 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={() => setSidebarOpen((v) => !v)}>
          <Filter className="h-4 w-4" />
          {sidebarOpen
            ? t("orders.filters.hideButton")
            : t("orders.filters.showButton")}
        </Button>
      </div>
    </motion.div>
  );
};

export default OrderHeader;
