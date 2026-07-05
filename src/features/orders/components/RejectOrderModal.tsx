import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { useRejectOrder } from "../api/actions";

interface RejectModalProps {
  orderId: number | null;
  onClose: () => void;
}

export function RejectOrderModal({ onClose, orderId }: RejectModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const OPEN_KEY = "reject-invector-request" + orderId;
  const reject = useRejectOrder();

  const handlSubmit = () => {
    if (reason.trim()) {
      reject.mutate(
        { OrderId: Number(orderId), reason },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  useEffect(() => {
    return () => {
      onClose();
    };
  }, [orderId]);

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t(`resourceProvidor.investor-request.reject-modal.title`)}
      subTitle={
        orderId
          ? t(
              `resourceProvidor.investor-request.reject-modal.description_with_name`,
              { name: orderId },
            )
          : t(
              `resourceProvidor.investor-request.reject-modal.description_generic`,
            )
      }
      openButton={
        <Button variant="outline" size="sm">
          {t("orders.orderDetailsModal.labels.viewDetails")}
        </Button>
      }
      children={
        <div>
          {/* Main Body Input fields area */}
          <div className="space-y-2 my-4">
            <Label htmlFor="reject-reason">
              {t(`resourceProvidor.investor-request.reject-modal.label`)}
            </Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t(
                `resourceProvidor.investor-request.reject-modal.placeholder`,
              )}
              rows={4}
            />
          </div>

          {/* Form Action Controls matching standard Dialog footer flex distribution */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
            <Button
              variant="destructive"
              disabled={!reason.trim()}
              isLoading={reject.isPending}
              onClick={handlSubmit}
            >
              {t(
                `resourceProvidor.investor-request.reject-modal.actions.confirm`,
              )}
            </Button>
          </div>
        </div>
      }
    />
  );
}
