import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface EngineerApproveModalProps {
  openButton: ReactNode;
  engineerId: string;
  onConfirm: () => void;
}

const EngineerApproveModal = ({
  openButton,
  engineerId,
  onConfirm,
}: EngineerApproveModalProps) => {
  const { t } = useTranslation();
  const OPEN_KEY = `approve-engineer-${engineerId}`;

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      openButton={openButton}
      title={t("engineerVerification.approveModal.title")}
      subTitle={t("engineerVerification.approveModal.description")}
    >
      {(close) => (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t("engineerVerification.approveModal.description")}
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={close}
            >
              {t("engineerVerification.approveModal.cancelLabel")}
            </Button>
            <Button
              variant="default"
              onClick={() => {
                onConfirm();
                close();
              }}
            >
              <Check className="h-4 w-4" />
              {t("engineerVerification.approveModal.confirm")}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
};

export default EngineerApproveModal;
