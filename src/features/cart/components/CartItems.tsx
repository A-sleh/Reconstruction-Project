import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { Boxes, Minus, Plus, ShoppingCart, Trash2, Wrench } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CartItem } from "@/features/cart/types";
import { fmtCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import useCartStore, { selectProjectItems } from "@/stores/useCartStore";
import BuyNowConfirmPopup from "./BuyNowConfirmPopup";

interface CartItemsProps {
  projectId: number;
  /** Called after a successful checkout so parents can close their container */
  onOrdered?: () => void;
}

interface CartItemRowProps {
  projectId: number;
  item: CartItem;
}

const STEP_BUTTON_CLASS = cn(
  "flex h-7 w-7 items-center justify-center rounded-md border border-gray-300",
  "hover:bg-muted disabled:pointer-events-none disabled:opacity-40",
);

function CartItemRow({ projectId, item }: CartItemRowProps) {
  const { t } = useTranslation();
  const removeItem = useCartStore((s) => s.removeItem);
  const incrementQuantity = useCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useCartStore((s) => s.decrementQuantity);
  const isResource = item.itemType === "Resource";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-2.5">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-md object-cover bg-muted"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
          {isResource ? (
            <Boxes className="h-5 w-5 text-primary/40" />
          ) : (
            <Wrench className="h-5 w-5 text-primary/40" />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{item.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {item.providerName}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {fmtCurrency(item.price)} / {item.unit}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={t("cart.popup.quantity")}
          disabled={item.quantity === 1}
          onClick={() => decrementQuantity(projectId, item.id, item.itemType)}
          className={cn(STEP_BUTTON_CLASS)}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-semibold tabular-nums">
          {item.quantity}
        </span>
        <button
          type="button"
          aria-label={t("cart.popup.quantity")}
          onClick={() => incrementQuantity(projectId, item.id, item.itemType)}
          className={cn(STEP_BUTTON_CLASS)}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold">
          {fmtCurrency(item.price * item.quantity)}
        </span>
        <button
          type="button"
          title={t("cart.items.remove")}
          aria-label={t("cart.items.remove")}
          onClick={() => removeItem(projectId, item.id, item.itemType)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            "text-destructive hover:bg-destructive/10",
          )}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CartItems({ projectId, onOrdered }: CartItemsProps) {
  const { t } = useTranslation();
  const items = useCartStore(useShallow(selectProjectItems(projectId)));

  if (!items.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-10 text-center">
        <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium">{t("cart.items.empty")}</p>
        <p className="text-xs text-muted-foreground">{t("cart.items.emptyHint")}</p>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const resourceItems = items.filter((item) => item.itemType === "Resource");
  const serviceItems = items.filter((item) => item.itemType === "Service");

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="resources" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resources" className="gap-2">
            <Boxes className="h-4 w-4" />
            {t("cart.items.tabs.resources")}
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Wrench className="h-4 w-4" />
            {t("cart.items.tabs.services")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="resources" className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {resourceItems.map((item) => (
              <CartItemRow key={`${item.itemType}-${item.id}`} projectId={projectId} item={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="services" className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {serviceItems.map((item) => (
              <CartItemRow key={`${item.itemType}-${item.id}`} projectId={projectId} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-auto space-y-3 border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">{t("cart.footer.total")}</span>
          <span className="text-lg font-bold text-primary">{fmtCurrency(total)}</span>
        </div>
        <BuyNowConfirmPopup projectId={projectId} disabled={!items.length} onOrdered={onOrdered} />
      </div>
    </div>
  );
}

export default CartItems;
