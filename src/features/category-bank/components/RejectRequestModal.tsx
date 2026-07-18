import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import PopuupLayout from "@/components/layouts/Popup-layout";

interface RejectRequestModalProps {
  requestId: number | null;
  openButton: React.ReactNode;
  onConfirm: (reason: string) => void;
}

export function RejectRequestModal({
  openButton,
  requestId,
  onConfirm,
}: RejectRequestModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const OPEN_KEY = "reject-category-request" + requestId;

  const handleSubmit = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("categoryBank.rejectModal.title", { defaultValue: "Reject Request" })}
      subTitle={t("categoryBank.rejectModal.description", {
        defaultValue: "Provide a reason for rejecting this category request.",
      })}
      openButton={openButton}
    >
      <div className="space-y-2 my-4">
        <Label htmlFor="reject-reason">
          {t("categoryBank.rejectModal.label", { defaultValue: "Rejection Reason" })}
        </Label>
        <Textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("categoryBank.rejectModal.placeholder", {
            defaultValue: "Enter the reason for rejection...",
          })}
          rows={4}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
        <Button
          variant="destructive"
          disabled={!reason.trim()}
          onClick={handleSubmit}
        >
          {t("categoryBank.rejectModal.actions.confirm", { defaultValue: "Reject" })}
        </Button>
      </div>
    </PopuupLayout>
  );
}
