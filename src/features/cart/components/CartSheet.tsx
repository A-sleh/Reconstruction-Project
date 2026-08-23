import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItems from "@/features/cart/components/CartItems";
import useCartStore, {
  selectProjectTotalQuantity,
} from "@/stores/useCartStore";

interface CartSheetProps {
  projectId: number;
  projectName: string;
}

const CartSheet = ({ projectId, projectName }: CartSheetProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const count = useCartStore(selectProjectTotalQuantity(projectId));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t("cart.popup.title")}
          title={t("cart.popup.title")}
          className="relative h-9 w-9 rounded-md border border-gray-300 bg-white text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
        >
          <ShoppingCart className="mx-auto h-4 w-4" />
          {count > 0 && (
            <span className="absolute -top-1.5 -end-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-foreground">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <div className="border-b border-gray-200 p-4">
          <SheetTitle>{projectName}</SheetTitle>
          <SheetDescription>{t("cart.sheet.description")}</SheetDescription>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <CartItems
            projectId={projectId}
            onOrdered={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
