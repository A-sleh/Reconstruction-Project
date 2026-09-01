import { Badge } from "@/components/ui/Badge";
import { Activity } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const StatisticsHeader = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-4 flex-wrap rounded-lg bg-white w-full px-5 py-12 lg:py-16"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("engineerStatistics.header.insights")}
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight">
          {t("engineerStatistics.header.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("engineerStatistics.header.description")}
        </p>
      </div>
      <Badge className="gap-1.5">
        <Activity className="h-3.5 w-3.5" />{" "}
        {t("engineerStatistics.header.liveData")}
      </Badge>
    </motion.div>
  );
};

export default StatisticsHeader;
