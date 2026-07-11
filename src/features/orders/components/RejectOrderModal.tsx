import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { useCancelOrder, useRejectOrder } from "../api/actions";

interface RejectModalProps {
  orderId: number | null;
  openButton: React.ReactNode;
  actionType?: "reject" | "cancel";
}

export function RejectOrderModal({
  openButton,
  orderId,
  actionType = "reject",
}: RejectModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const OPEN_KEY = "reject-invector-request" + orderId;
  const reject = useRejectOrder();
  const cancel = useCancelOrder();
  const modalPrefix =
    actionType === "reject" ? "reject-modal" : "cancel-modal";
  const isPending = actionType === "reject" ? reject.isPending : cancel.isPending;

  const handlSubmit = () => {
    if (reason.trim()) {
      if (actionType === "reject") {
        reject.mutate(
          { OrderId: Number(orderId), reason },
          {
            onSuccess: () => {},
          },
        );
      } else {
        cancel.mutate(
          { orderId: Number(orderId), note: reason },
          {
            onSuccess: () => {},
          },
        );
      }
    }
  };

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t(`resourceProvidor.investor-request.${modalPrefix}.title`)}
      subTitle={
        orderId
          ? t(
              `resourceProvidor.investor-request.${modalPrefix}.description_with_name`,
              { name: orderId },
            )
          : t(
              `resourceProvidor.investor-request.${modalPrefix}.description_generic`,
            )
      }
      openButton={openButton}
      children={
        <div>
          {/* Main Body Input fields area */}
          <div className="space-y-2 my-4">
            <Label htmlFor="reject-reason">
              {t(`resourceProvidor.investor-request.${modalPrefix}.label`)}
            </Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t(
                `resourceProvidor.investor-request.${modalPrefix}.placeholder`,
              )}
              rows={4}
            />
          </div>

          {/* Form Action Controls matching standard Dialog footer flex distribution */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
            <Button
              variant="destructive"
              disabled={!reason.trim()}
              isLoading={isPending}
              onClick={handlSubmit}
            >
              {t(
                `resourceProvidor.investor-request.${modalPrefix}.actions.confirm`,
              )}
            </Button>
          </div>
        </div>
      }
    />
  );
}
