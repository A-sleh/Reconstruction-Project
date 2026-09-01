import { Badge } from "@/components/ui/Badge";
import { Activity, Info } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const FinancialHeader = () => {
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      dir={i18n.dir()}
      className="flex items-start justify-between gap-4 flex-wrap rounded-lg bg-white w-full px-5 py-10"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("project.financial.badge")}
        </p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">
          {t("project.financial.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("project.financial.description")}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge className="gap-1.5">
          <Activity className="h-3.5 w-3.5" />
          {t("project.financial.liveData")}
        </Badge>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          {t("project.financial.sampleHint")}
        </p>
      </div>
    </motion.div>
  );
};

export default FinancialHeader;
