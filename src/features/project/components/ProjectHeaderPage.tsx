import { Building2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const ProjectHeaderPage = () => {
  const { t } = useTranslation();
  const prefix = "project.header";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-wrap items-start justify-between gap-4 rounded-lg bg-white px-5 py-3 lg:py-10"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Building2 className="h-3 w-3" /> {t(`${prefix}.badge`)}
        </div>
        <h1 className="mt-3 text-3xl lg:text-4xl font-bold">
          {t(`${prefix}.title`)}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t(`${prefix}.description`)}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectHeaderPage;
