import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";

const BasicLandInfoHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-start justify-between gap-4 bg-white py-6 px-4 rounded-lg"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {t("investor.dashboard")}
        </p>
        <h1 className="text-3xl font-semibold mt-1 text-foreground">
          {t("investor.add-land")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("investor.land-form-description")}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => navigate(paths.app.investor.hisLandsAndBuildings.getHref())}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("investor.back")}
      </Button>
    </motion.div>
  );
};

export default BasicLandInfoHeader;
