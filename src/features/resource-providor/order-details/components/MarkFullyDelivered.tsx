import { OrderStatus } from "@/features/orders/api/types";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMarkAsReceived } from "@/features/orders/api/actions";

interface MarkFullyDeliveredProps {
  id: number | string;
  total: number;
  delivered: number;
  fullyDelivered: boolean;
  totalInvoiced: number;
  status: OrderStatus;
}

const MarkFullyDelivered: React.FC<MarkFullyDeliveredProps> = ({
  delivered = 0,
  fullyDelivered = false,
  total = 0,
  totalInvoiced = 0,
  status = "" as OrderStatus,
  id = "",
}) => {
  const { t } = useTranslation();
  const { mutate: markFullyDelivered, isPending } =
    useMarkAsReceived();

  return (
    <div className="mt-6 rounded-xl border border-gray-300 bg-card p-4 flex items-center justify-between flex-wrap gap-3 bg-white">
      <div>
        <p className="text-sm font-medium mb-2">
          {t(`resourceProvidor.investor-request-details.delivery.title`)}
        </p>
        <p className="text-xs text-muted-foreground">
          {t(`resourceProvidor.investor-request-details.delivery.description`, {
            delivered,
            total,
            invoiced: totalInvoiced.toLocaleString(),
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Adds visual feedback spinner while the background transaction resolves */}
        {isPending && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
        <Switch
          checked={fullyDelivered}
          disabled={status === "Cancelled" || total === 0 || isPending}
          onCheckedChange={(checked) => {
            if (checked) {
              markFullyDelivered({
                orderId: Number(id),
                receiveDate: new Date().toISOString().split("T")[0], 
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default MarkFullyDelivered;
