import { Inbox } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useInvestoryRequestsStat } from "../api/query";

const OrderHeader = () => {
  const { t } = useTranslation();
  const { data: stat, isPending } = useInvestoryRequestsStat();

  // Prefix variable to keep keys clean and readable
  const prefix = "resourceProvidor.investor-request.investor-header";

  const stats = [
    {
      label: t(`${prefix}.stats.pending`),
      value: isPending ? "--" : (stat?.pending ?? 0),
    },
    {
      label: t(`${prefix}.stats.partial`),
      value: isPending ? "--" : (stat?.partial ?? 0),
    },
    {
      label: t(`${prefix}.stats.completed`),
      value: isPending ? "--" : (stat?.completed ?? 0),
    },
    {
      label: t(`${prefix}.stats.total`),
      value: isPending ? "--" : (stat?.total ?? 0),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-4 flex-wrap rounded-lg bg-white w-full px-5 py-12 lg:py-16"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Inbox className="h-3 w-3" /> {t(`${prefix}.badge`)}
        </div>
        <h1 className="mt-3 text-3xl lg:text-4xl font-bold">
          {t(`${prefix}.title`)}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t(`${prefix}.description`)}
        </p>
      </div>
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
    </motion.div>
  );
};

export default OrderHeader;
