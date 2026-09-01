import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { useVerifyProperty } from "../api/actions";

interface PropertyApproveModalProps {
  openButton: ReactNode;
  propertyId: string;
  onConfirm: () => void;
}

const PropertyApproveModal = ({
  openButton,
  propertyId,
  onConfirm,
}: PropertyApproveModalProps) => {
  const { t } = useTranslation();
  const { mutate: verifyProperty, isPending } = useVerifyProperty();
  const OPEN_KEY = `approve-property-${propertyId}`;

  function handleConfirm(close: () => void) {
    verifyProperty(
      { propertyId, decision: "APPROVED" },
      {
        onSuccess: () => {
          onConfirm();
          close();
        },
      },
    );
  }

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      openButton={openButton}
      title={t("buildingVerification.approveModal.title")}
      subTitle={t("buildingVerification.approveModal.description")}
    >
      {(close) => (
        <div className="flex items-center justify-end gap-3 py-4">
          <Button variant="outline" onClick={close}>
            {t("buildingVerification.approveModal.cancelLabel")}
          </Button>
          <Button
            isLoading={isPending}
            onClick={() => handleConfirm(close)}
          >
            {t("buildingVerification.approveModal.confirm")}
          </Button>
        </div>
      )}
    </PopuupLayout>
  );
};

export default PropertyApproveModal;
