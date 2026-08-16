import { motion } from "framer-motion";
import { Button } from "../ui/button"; // Assuming you have your custom Button component
import Model from "@/components/model/Model";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteProps {
  openButton: React.ReactNode;
  onConfirm: () => void;
  item?: string;
  isLoading?: boolean;
  openKey?: string;
  keys?: {
    title?: string;
    descriptionPrefix?: string;
    confirm?: string;
    cancel?: string;
  };
}

const ConfirmDelete = ({
  isLoading = false,
  onConfirm,
  item,
  openButton,
  openKey,
  keys,
}: ConfirmDeleteProps) => {
  const { t } = useTranslation();
  const modalKey = openKey ?? "delete-work-site" + item;
  const onSubmit = (e: any) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <Model>
      <Model.Open opens={openKey}>{openButton}</Model.Open>
      <Model.Window name={openKey} model_width="max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="p-2 rounded-2xl bg-white"
        >
          {/* Header Section */}
          <div className="mb-4 flex items-start gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-foreground">
                {t(keys?.title ?? "workSites.delete-title", {
                  defaultValue: "Delete this work site?",
                })}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {t(keys?.descriptionPrefix ?? "workSites.delete-description-prefix", {
                  defaultValue: "This will permanently remove ",
                })}
                <span className="font-semibold text-foreground">
                  {item || ""}
                </span>
              </p>
            </div>
          </div>

          {/* Footer Actions Section */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              disabled={isLoading}
              onClick={onSubmit}
              type="button"
              variant="destructive"
              className="gap-2 text-sm"
            >
              {isLoading ? (
                t("common.loading", "Saving...")
              ) : (
                <>
                  <Trash2 className="h-4 w-4 opacity-90" />
                  {t(keys?.confirm ?? "workSites.btn-delete-confirm", {
                    defaultValue: "Delete site",
                  })}
                </>
              )}
            </Button>
            {/* Model.Close intercepts the trigger to seamlessly clear the popup open state */}
            <Model.Close>
              <Button type="button" variant="outline" className="text-sm">
                {t(keys?.cancel ?? "workSites.btn-cancel", {
                  defaultValue: "Cancel",
                })}
              </Button>
            </Model.Close>
          </div>
        </motion.div>
      </Model.Window>
    </Model>
  );
};

export default ConfirmDelete;
