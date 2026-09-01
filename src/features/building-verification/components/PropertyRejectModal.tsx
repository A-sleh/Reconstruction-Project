import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVerifyProperty } from "../api/actions";

interface PropertyRejectModalProps {
  openButton: ReactNode;
  propertyId: string;
  onConfirm: (reason: string) => void;
}

const PropertyRejectModal = ({
  openButton,
  propertyId,
  onConfirm,
}: PropertyRejectModalProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const { mutate: verifyProperty, isPending } = useVerifyProperty();
  const OPEN_KEY = `reject-property-${propertyId}`;

  function handleConfirm(close: () => void) {
    setTouched(true);
    if (!reason.trim()) return;

    verifyProperty(
      { propertyId, decision: "REJECTED", reason: reason.trim() },
      {
        onSuccess: () => {
          onConfirm(reason.trim());
          setReason("");
          setTouched(false);
          close();
        },
      },
    );
  }

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      openButton={openButton}
      title={t("buildingVerification.rejectModal.title")}
      subTitle={t("buildingVerification.rejectModal.description")}
    >
      {(close) => (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("buildingVerification.rejectModal.reasonLabel")}
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("buildingVerification.rejectModal.reasonPlaceholder")}
              rows={4}
            />
            {touched && !reason.trim() && (
              <p className="text-xs text-destructive">
                {t("buildingVerification.rejectModal.reasonRequired")}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={close}>
              {t("buildingVerification.rejectModal.cancelLabel")}
            </Button>
            <Button
              variant="destructive"
              isLoading={isPending}
              disabled={!reason.trim()}
              onClick={() => handleConfirm(close)}
            >
              {t("buildingVerification.rejectModal.confirm")}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
};

export default PropertyRejectModal;
