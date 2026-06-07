import { t } from "i18next";
import { motion } from "motion/react";

const Header = () => {
  const prefix = "resourceProvidor.profile";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-4 flex-wrap rounded-lg bg-white w-full px-5 py-12 lg:py-8"
    >
      <div>
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

export default Header;
