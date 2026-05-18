import { motion } from "framer-motion";
import { Button } from "../ui/button"; // Assuming you have your custom Button component
import Model from "@/components/model/Model";
import { useTranslation } from "react-i18next";

interface ConfirmDeleteProps {
  openButton: React.ReactNode;
  onConfirm: () => void;
  item?: string;
}

const ConfirmDelete = ({ onConfirm, item, openButton }: ConfirmDeleteProps) => {
  const { t } = useTranslation();

  return (
    <Model>
      <Model.Open opens="delete-work-site">{openButton}</Model.Open>
      <Model.Window name="delete-work-site" model_width="max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="p-6 rounded-2xl" // Set alignment based on your active locale style needs
        >
          {/* Header Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("resourceProvidor.workSites.delete-title", {
                defaultValue: "Delete this work site?",
              })}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {t("resourceProvidor.workSites.delete-description-prefix", {
                defaultValue: "This will permanently remove ",
              })}
              <span className="font-semibold text-foreground">
                {item || ""}
              </span>
            </p>
          </div>

          {/* Footer Actions Section */}
          <div className="flex  items-center gap-3 pt-3">
            <Button
              onClick={onConfirm}
              variant="outline"
              className="text-[14px] px-4  bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:bg-primary transition-all hover:text-white"
            >
              {t("resourceProvidor.workSites.btn-delete-confirm", {
                defaultValue: "Delete site",
              })}
            </Button>
            {/* Model.Close intercepts the trigger to seamlessly clear the popup open state */}
            <Model.Close>
              <Button
                type="button"
                variant="default"
                className="text-[14px] px-4 bg-red-400 hover:bg-red-300"
              >
                {t("resourceProvidor.workSites.btn-cancel", {
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
