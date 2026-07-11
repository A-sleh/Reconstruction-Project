import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { useCancelOrderItem } from "@/features/orders/api/actions";

interface CancelOrderItemModalProps {
  orderItemId: number;
  itemName: string;
  openButton: React.ReactNode;
}

export function CancelOrderItemModal({
  orderItemId,
  itemName,
  openButton,
}: CancelOrderItemModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const OPEN_KEY = "cancel-order-item-" + orderItemId;
  const cancelItem = useCancelOrderItem();

  const handlSubmit = () => {
    if (reason.trim()) {
      cancelItem.mutate(
        { orderItemId, note: reason },
        {
          onSuccess: () => {
            setReason("");
          },
        },
      );
    }
  };

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t(`resourceProvidor.investor-request-details.cancel-item-modal.title`)}
      subTitle={
        itemName
          ? t(
              `resourceProvidor.investor-request-details.cancel-item-modal.description_with_name`,
              { name: itemName },
            )
          : t(
              `resourceProvidor.investor-request-details.cancel-item-modal.description_generic`,
            )
      }
      openButton={openButton}
      children={
        <div>
          <div className="space-y-2 my-4">
            <Label htmlFor="cancel-item-reason">
              {t(`resourceProvidor.investor-request-details.cancel-item-modal.label`)}
            </Label>
            <Textarea
              id="cancel-item-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t(
                `resourceProvidor.investor-request-details.cancel-item-modal.placeholder`,
              )}
              rows={4}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
            <Button
              variant="destructive"
              disabled={!reason.trim()}
              isLoading={cancelItem.isPending}
              onClick={handlSubmit}
            >
              {t(
                `resourceProvidor.investor-request-details.cancel-item-modal.actions.confirm`,
              )}
            </Button>
          </div>
        </div>
      }
    />
  );
}
