import { useState, useEffect, useContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import Model from "@/components/model/Model";

interface RejectModalProps {
  openButton: ReactNode;
  investorName?: string;
  onConfirm: (reason: string) => void;
}

export function RejectModalContent({
  investorName,
  openButton,
  onConfirm,
}: RejectModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const OPEN_KEY = "reject-invector-request" + investorName

  return (
    <Model>
      <Model.Open opens={OPEN_KEY}>
        {openButton}
      </Model.Open>

      <Model.Window name={OPEN_KEY}>
        {/* Structural Header Wrapper matching standard UI spacing layout */}
        <div className="flex flex-col space-y-1.5 border-b border-gray-300 pb-4  mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {t(`resourceProvidor.investor-request.reject-modal.title`)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {investorName
              ? t(`resourceProvidor.investor-request.reject-modal.description_with_name`, { name: investorName })
              : t(`resourceProvidor.investor-request.reject-modal.description_generic`)}
          </p>
        </div>

        {/* Main Body Input fields area */}
        <div className="space-y-2 my-4">
          <Label htmlFor="reject-reason">{t(`resourceProvidor.investor-request.reject-modal.label`)}</Label>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t(`resourceProvidor.investor-request.reject-modal.placeholder`)}
            rows={4}
          />
        </div>

        {/* Form Action Controls matching standard Dialog footer flex distribution */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
          <Model.Close>
            <Button variant="outline">{t(`resourceProvidor.investor-request.reject-modal.actions.cancel`)}</Button>
          </Model.Close>

          <Button
            variant="destructive"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            {t(`resourceProvidor.investor-request.reject-modal.actions.confirm`)}
          </Button>
        </div>
      </Model.Window>
    </Model>
  );
}
