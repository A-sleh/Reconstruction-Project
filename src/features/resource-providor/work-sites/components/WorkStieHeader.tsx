import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useWorkSitesStatistics } from "@/features/resource-providor/work-sites/api/query";

const WorkSiteHeader = () => {
  const { t } = useTranslation();
  const { data: statsData, isLoading } = useWorkSitesStatistics();

  const stats = [
    {
      label: t("resourceProvidor.workSites.activeSites"),
      value: isLoading ? "—" : statsData?.activeWorkSites ?? 0,
    },
    {
      label: t("resourceProvidor.workSites.total-sites"),
      value: isLoading ? "—" : statsData?.totalWorkSites ?? 0,
    },
    {
      label: t("resourceProvidor.workSites.traked-resourrces"),
      value: isLoading ? "—" : statsData?.onHoldWorkSites ?? 0,
    },
  ];

  return (
    <div className="w-full px-5 py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary  px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {t("resourceProvidor.workSites.sub-title")}
        </div>
        <h1 className="mt-4 text-4xl lg:text-5xl font-bold leading-tight">
          {t("resourceProvidor.workSites.title")}
        </h1>
        <p className="mt-3 text-base lg:text-lg text-muted-foreground">
          {t("resourceProvidor.workSites.description")}
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-3 gap-4 max-w-2xl">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-xl border border-gray-200 text-white bg-primary p-4 shadow-sm"
          >
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs  mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkSiteHeader;
