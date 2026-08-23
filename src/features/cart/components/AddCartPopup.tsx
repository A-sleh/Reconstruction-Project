import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Boxes, Minus, Plus, ShoppingCart, Wrench } from "lucide-react";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { fmtCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { CartItemInput } from "@/features/cart/types";
import useCartStore from "@/stores/useCartStore";

interface AddCartPopupProps<T extends CartItemInput> {
  item: T;
  projectId: number;
  openButton?: React.ReactNode;
}

function AddCartPopup<T extends CartItemInput>({ item, projectId, openButton }: AddCartPopupProps<T>) {
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const isResource = item.itemType === "Resource";

  const defaultTrigger = (
    <button
      type="button"
      title={t("cart.popup.title")}
      aria-label={t("cart.popup.title")}
      className="rounded-full bg-white/90 p-2 text-foreground shadow-sm backdrop-blur transition-smooth hover:bg-white hover:text-primary"
    >
      <ShoppingCart className="h-4 w-4" />
    </button>
  );

  const handleSubmit = (closeModal: () => void) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        unit: item.unit,
        imageUrl: item.imageUrl,
        itemType: item.itemType,
        categoryName: item.categoryName,
        providerName: item.providerName,
        projectId,
      },
      quantity,
    );
    toast.success(t("cart.popup.addedSuccess", { name: item.name, quantity }));
    setQuantity(1);
    closeModal();
  };

  return (
    <PopuupLayout
      openKey={`add-cart-${item.itemType}-${item.id}`}
      title={t("cart.popup.title")}
      subTitle={item.name}
      openButton={openButton ?? defaultTrigger}
    >
      {(closeModal) => (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="h-16 w-16 rounded-md object-cover bg-muted"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                {isResource ? (
                  <Boxes className="h-6 w-6 text-primary/40" />
                ) : (
                  <Wrench className="h-6 w-6 text-primary/40" />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.providerName}</div>
              <span className="mt-1 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                {isResource ? t("cart.popup.resource") : t("cart.popup.service")}
                <span className="mx-1 text-muted-foreground">·</span>
                {item.categoryName}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("cart.popup.unitPrice")}</span>
            <span>
              {fmtCurrency(item.price)}{" "}
              <span className="text-muted-foreground">/ {item.unit}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("cart.popup.quantity")}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="decrease quantity"
                disabled={quantity === 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md border border-gray-300",
                  "hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold tabular-nums">{quantity}</span>
              <button
                type="button"
                aria-label="increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md border border-gray-300",
                  "hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="font-medium">{t("cart.popup.totalPrice")}</span>
            <span className="text-lg font-bold text-primary">
              {fmtCurrency(item.price * quantity)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit(closeModal)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5",
              "text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
              "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {t("cart.popup.addToCart")}
          </button>
        </div>
      )}
    </PopuupLayout>
  );
}

export default AddCartPopup;
