import { Skeleton } from "@/components/ui/Skeleton";
import { useTranslation } from "react-i18next";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useOrderDetails } from "../api/query";
import PopuupLayout from "@/components/layouts/Popup-layout";
interface Props {
  orderId: number | null;
  openButton: React.ReactNode;
}

export function OrderDetailsModal({ orderId, openButton }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useOrderDetails({
    OrderId: Number(orderId),
  });

  return (
    <PopuupLayout
      title={t("orders.orderDetailsModal.title")}
      subTitle={`${t("orders.orderDetailsModal.subtitle")} ${orderId}`}
      openKey={`order-details-${orderId}`}
      children={
        isLoading || !data ? (
          <div className="space-y-3 mt-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="space-y-4 mt-2">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div>
                  {/* Updated to display the Request Owner instead of an item name */}
                  <h3 className="font-semibold">
                    {data.orderDetails.ownerName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t("orders.orderDetailsModal.labels.orderId")} #
                    {data.orderDetails.id} ·{" "}
                    {t("orders.orderDetailsModal.labels.requested")}{" "}
                    {new Date(
                      data.orderDetails?.requestedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
                {/* Updated to use the base Order status */}
                <OrderStatusBadge status={data.orderDetails.status} />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field
                  label={t("orders.orderDetailsModal.fields.fulfillRate")}
                  value={`${data.orderDetails.fulfillRate}%`}
                />
                <Field
                  label={t("orders.orderDetailsModal.fields.totalPrice")}
                  value={`$${data.orderDetails.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <Field
                  label={t("orders.orderDetailsModal.fields.discount")}
                  value={`$${data.orderDetails.totalDiscountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <Field
                  label={t("orders.orderDetailsModal.fields.netTotal")}
                  value={`$${data.orderDetails.netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
              </div>
            </div>
          </div>
        )
      }
      openButton={openButton}
    />
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-300 p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-medium tabular-nums mt-0.5">{value}</p>
    </div>
  );
}
