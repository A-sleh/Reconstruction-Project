import { motion } from "motion/react";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { RejectOrderModal } from "@/features/orders/components/RejectOrderModal";
import { useApproveOrder, useCancelOrder } from "@/features/orders/api/actions";
import { OrderDetails } from "@/features/orders/api/types";
interface OrderDetailsHeaderProps {
  orderDetails: OrderDetails;
}

const OrderDetailsHeader = ({ orderDetails }: OrderDetailsHeaderProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const { mutate: approve, isPending: isAproved } = useApproveOrder();
  const formattedDate = new Date(orderDetails.requestedAt).toLocaleDateString();

  const handleApprove = (id: number) => {
    approve({ OrderId: Number(id) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 flex flex-wrap items-start justify-between gap-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div>
        <h1 className="text-3xl font-bold">{orderDetails.ownerName}</h1>
        <p className="text-white mb-2">
          {t(`resourceProvidor.investor-request-details.requested_on`, {
            date: formattedDate,
          })}
        </p>
        <OrderStatusBadge status={orderDetails.status} />
      </div>
      <div className="flex items-center gap-2">
        <Button
          hidden={orderDetails.status != "PendingApproval"}
          size="sm"
          variant="outline"
          isLoading={isAproved}
          className="border-success/40 text-success hover:opacity-80 rounded-xl hover:text-green-300 hover:bg-white"
          disabled={orderDetails.status === "Completed" || isAproved}
          onClick={() => handleApprove(orderDetails.id)}
        >
          <Check className="h-4 w-4 mr-1" />
          {t(`resourceProvidor.investor-request.table.actions.approve`)}
        </Button>
        <RejectOrderModal
          orderId={orderDetails.id}
          openButton={
            <Button
              hidden={orderDetails.status != "PendingApproval"}
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:opacity-80 rounded-xl hover:bg-white hover:text-red-400"
              disabled={orderDetails.status === "Cancelled"}
            >
              <X className="h-4 w-4 mr-1" />
              {t(`resourceProvidor.investor-request.table.actions.reject`)}
            </Button>
          }
          actionType="reject"
        />
        <RejectOrderModal
          orderId={orderDetails.id}
          openButton={
            <Button
              hidden={orderDetails.status != "Preparing"}
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:opacity-80 rounded-xl hover:bg-white hover:text-red-400"
              disabled={orderDetails.status === "Cancelled"}
            >
              <X className="h-4 w-4 mr-1" />
              {t(`resourceProvidor.investor-request.table.actions.cancel`)}
            </Button>
          }
          actionType="cancel"
        />
      </div>
    </motion.div>
  );
};

export default OrderDetailsHeader;
