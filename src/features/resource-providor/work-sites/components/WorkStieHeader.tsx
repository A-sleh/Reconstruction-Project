import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const WorkSiteHeader = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t("resourceProvidor.workSites.activeSites"), value: 10 },
    { label: t("resourceProvidor.workSites.total-sites"), value: 11 },
    { label: t("resourceProvidor.workSites.traked-resourrces"), value: 20 },
  ];

  return (
    <div className="container px-5 py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200  px-3 py-1 text-xs font-medium text-muted-foreground">
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
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkSiteHeader;
