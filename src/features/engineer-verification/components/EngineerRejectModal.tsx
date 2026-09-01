import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface EngineerRejectModalProps {
  openButton: ReactNode;
  engineerId: string;
  onConfirm: (reason: string) => void;
}

const EngineerRejectModal = ({
  openButton,
  engineerId,
  onConfirm,
}: EngineerRejectModalProps) => {
  const { t } = useTranslation();
  const OPEN_KEY = `reject-engineer-${engineerId}`;
  const [reason, setReason] = useState("");

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      openButton={openButton}
      title={t("engineerVerification.rejectModal.title")}
      subTitle={t("engineerVerification.rejectModal.description")}
    >
      {(close) => (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">
              {t("engineerVerification.rejectModal.reasonLabel")}
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t(
                "engineerVerification.rejectModal.reasonPlaceholder",
              )}
              className="mt-2"
            />
            {reason.trim().length === 0 && (
              <p className="mt-1 text-xs text-destructive">
                {t("engineerVerification.rejectModal.reasonRequired")}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={close}
            >
              {t("engineerVerification.rejectModal.cancelLabel")}
            </Button>
            <Button
              variant="destructive"
              disabled={reason.trim().length === 0}
              onClick={() => {
                onConfirm(reason);
                close();
              }}
            >
              <X className="h-4 w-4" />
              {t("engineerVerification.rejectModal.confirm")}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
};

export default EngineerRejectModal;
