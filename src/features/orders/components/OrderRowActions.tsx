import { Check, Eye, ListChecks, MoreVertical, Wallet, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/features/orders/api/types";
import { AddPaymentModal } from "./AddPaymentModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { RejectOrderModal } from "./RejectOrderModal";

interface Props {
  order: Order;
  onApprove?: () => void;
  onShowItems: () => void;
}

export function OrderRowActions({ order, onApprove, onShowItems }: Props) {
  const { t } = useTranslation();
  const isPending = order.status === "PendingApproval";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {order.ownerName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isPending ? (
          <>
            <DropdownMenuItem
              onClick={onApprove}
              className="text-emerald-600 focus:text-emerald-600"
            >
              <Check className="h-4 w-4" /> {t("orders.rowActions.approveOrder")}
            </DropdownMenuItem>

            <RejectOrderModal
              openButton={
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                >
                  <X className="h-4 w-4" /> {t("orders.rowActions.rejectOrder")}
                </DropdownMenuItem>
              }
              orderId={order.id}
            />

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onShowItems}>
              <ListChecks className="h-4 w-4" /> {t("orders.rowActions.showOrderItems")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <AddPaymentModal
              openButton={
                <DropdownMenuItem>
                  <Wallet className="h-4 w-4" /> {t("orders.rowActions.addPayment")}
                </DropdownMenuItem>
              }
              orderId={order.id}
            />
            <OrderDetailsModal
              openButton={
                <DropdownMenuItem>
                  <Eye className="h-4 w-4" /> {t("orders.rowActions.viewDetails")}
                </DropdownMenuItem>
              }
              orderId={order.id}
            />

            {/* <DropdownMenuItem onClick={onAddInvoice}>
              <FileText className="h-4 w-4" /> Add Receive Invoice
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
