import { useMemo, useState } from "react";

import { Info, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { errorToast, successToast } from "@/components/common/Toast";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import type { CartItem, CartItemType } from "@/features/cart/types";
import {
  useCreateResourceOrder,
  useCreateServiceOrder,
} from "@/features/orders/api/actions";
import { fmtCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import useCartStore, { selectProjectItems } from "@/stores/useCartStore";

interface BuyNowConfirmPopupProps {
  projectId: number;
  disabled?: boolean;
  onOrdered?: () => void;
}

interface OrderGroup {
  key: string;
  providerName: string;
  itemType: CartItemType;
  items: CartItem[];
}

const PRIMARY_BUTTON_CLASS =
  "flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const getGroupTotal = (group: OrderGroup) =>
  group.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

function BuyNowConfirmPopup({
  projectId,
  disabled,
  onOrdered,
}: BuyNowConfirmPopupProps) {
  const { t } = useTranslation();
  const items = useCartStore(useShallow(selectProjectItems(projectId)));
  const clearProjectCart = useCartStore((s) => s.clearProjectCart);
  const createResource = useCreateResourceOrder();
  const createService = useCreateServiceOrder();
  const [isPlacing, setIsPlacing] = useState(false);

  const groups = useMemo<OrderGroup[]>(() => {
    const map = new Map<string, OrderGroup>();
    for (const item of items) {
      const key = `${item.providerName}|${item.itemType}`;
      const existing = map.get(key);
      if (existing) {
        existing.items.push(item);
      } else {
        map.set(key, {
          key,
          providerName: item.providerName,
          itemType: item.itemType,
          items: [item],
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      if (a.itemType !== b.itemType) return a.itemType === "Resource" ? -1 : 1;
      return a.providerName.localeCompare(b.providerName);
    });
  }, [items]);

  const handleConfirm = async (closeModal: () => void) => {
    setIsPlacing(true);
    try {
      await Promise.all(
        groups.map((group) =>
          group.itemType === "Resource"
            ? createResource.mutateAsync({
                projectId,
                discountPercent: 0,
                discountValue: 0,
                items: group.items.map((item) => ({
                  resourceId: item.id,
                  quantity: item.quantity,
                })),
              })
            : createService.mutateAsync({
                projectId,
                discountPercent: 0,
                discountValue: 0,
                items: group.items.map((item) => ({
                  serviceId: item.id,
                  quantity: item.quantity,
                })),
              }),
        ),
      );
      successToast(t("cart.buyNow.success"));
      clearProjectCart(projectId);
      closeModal();
      onOrdered?.();
    } catch {
      errorToast(t("cart.buyNow.error"));
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <PopuupLayout
      openKey={`buy-now-${projectId}`}
      title={t("cart.buyNow.title")}
      openButton={
        <button
          type="button"
          disabled={disabled}
          className={cn(PRIMARY_BUTTON_CLASS)}
        >
          <ShoppingBag className="h-4 w-4" />
          {t("cart.footer.buyNow")}
        </button>
      }
    >
      {(closeModal) => (
        <div className="space-y-3 ">
          <div className="flex items-start gap-2 rounded-md border-s-2 border-primary bg-muted p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t("cart.buyNow.groupedHint")}</span>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {groups.map((group, index) => (
              <div
                key={group.key}
                className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {t("cart.buyNow.orderLabel", {
                      index: index + 1,
                      provider: group.providerName,
                    })}
                  </div>
                  <span className="mt-1 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                    {group.itemType === "Resource"
                      ? t("cart.popup.resource")
                      : t("cart.popup.service")}
                  </span>
                </div>
                <div className="shrink-0 pt-0.5 text-xs text-muted-foreground">
                  {t("cart.buyNow.orderMeta", {
                    count: group.items.length,
                    total: fmtCurrency(getGroupTotal(group)),
                  })}
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            isLoading={isPlacing}
            disabled={isPlacing || !groups.length}
            onClick={() => handleConfirm(closeModal)}
            className={cn(PRIMARY_BUTTON_CLASS)}
          >
            {t("cart.buyNow.confirm", { count: groups.length })}
          </Button>
        </div>
      )}
    </PopuupLayout>
  );
}

export default BuyNowConfirmPopup;
