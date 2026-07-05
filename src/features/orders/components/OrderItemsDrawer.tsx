import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { useOrderItems } from "../api/query";

interface Props {
  orderId: number | null;
  onClose: () => void;
}

export function OrderItemsDrawer({ orderId, onClose }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useOrderItems({
    OrderId: Number(orderId),
  });

  return (
    <Sheet open={!!orderId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("orders.orderItemsDrawer.title")}</SheetTitle>
          <SheetDescription>{t("orders.orderItemsDrawer.description")} {orderId}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}

          {data?.orderItems.map((it) => (
            <div
              key={it.itemId}
              className="flex items-center justify-between rounded-lg border border-gray-300 p-3"
            >
              <div>
                <p className="font-medium text-sm">{it.itemName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {it.quantity} {it.unit}
                </p>
              </div>
              <Badge variant="outline">{it.itemStatus}</Badge>
            </div>
          ))}

          {data && data?.orderItems?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t("orders.orderItemsDrawer.empty")}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
