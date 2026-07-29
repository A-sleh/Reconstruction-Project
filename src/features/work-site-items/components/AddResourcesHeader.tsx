import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface Props {
  rolePrefix: string;
  hasSelection: boolean;
  resourceCount: number;
  isSubmitting: boolean;
  onBack: () => void;
  onAddAnother: () => void;
  onSubmitAll: () => void;
}

export function AddResourcesHeader({
  rolePrefix,
  hasSelection,
  resourceCount,
  isSubmitting,
  onBack,
  onAddAnother,
  onSubmitAll,
}: Props) {
  const { t } = useTranslation();

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-300 gradient-hero text-primary-foreground rounded-lg p-6 flex items-center justify-between gap-3 mb-6"
    >
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 text-white hover:bg-white/20 gap-1.5 -ms-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("investor.back")}
        </Button>
        <h1 className="text-2xl font-semibold mb-2">
          {t(`${rolePrefix}.addResources.heading`)}
        </h1>
        <p className="text-sm text-white">
          {t(`${rolePrefix}.addResources.provide-details`)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="accent"
          onClick={onAddAnother}
          disabled={!hasSelection}
        >
          {t(`${rolePrefix}.addResources.add-another`)}
        </Button>
        <Button
          variant="default"
          className="bg-white text-primary hover:bg-white hover:opacity-75"
          onClick={onSubmitAll}
          disabled={resourceCount === 0 || isSubmitting}
        >
          {isSubmitting
            ? t("common.loading", "Saving...")
            : t(`${rolePrefix}.addResources.submit-resources`, {
                count: resourceCount,
              })}
        </Button>
      </div>
    </motion.header>
  );
}
