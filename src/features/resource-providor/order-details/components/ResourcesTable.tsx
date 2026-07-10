import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Package, Pencil } from "lucide-react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { OrderItem, OrderItemReceive } from "@/features/orders/api/types";
import ConfrimChanges from "@/components/common/ConfrimChanges";
import Progress from "@/components/common/Progress";
import { useParams } from "react-router";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { useAddReceiveInvoice } from "@/features/orders/api/actions";

interface ResourcesTableProps {
  items: OrderItem[];
}

const ResourcesTable = ({ items }: ResourcesTableProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { mutate: updateItemsQuantity, isPending } = useAddReceiveInvoice();

  const [localChanges, setLocalChanges] = useState<Record<number, number>>({});
  const hasChanges = Object.keys(localChanges).length > 0;

  const handleQuantityChange = (id: number, value: string, max: number) => {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      setLocalChanges((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      return;
    }

    const clampedValue = Math.max(0, Math.min(parsedValue, max));
    const originalResource = items.find((r) => r.itemId === id);

    if (
      originalResource &&
      originalResource.fulfilledQuantity === clampedValue
    ) {
      setLocalChanges((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      setLocalChanges((prev) => ({ ...prev, [id]: clampedValue }));
    }
  };

  const handleDiscard = () => {
    setLocalChanges({});
  };

  const handleSave = async () => {
    const orderItemReceives: OrderItemReceive[] = [];
    for (const [key, value] of Object.entries(localChanges)) {
      orderItemReceives.push({
        orderItemId: Number(key),
        quantity: value,
      });
    }

    updateItemsQuantity(
      {
        receivedDate: new Date().toISOString(),
        orderItemReceives,
      },
      {
        onSuccess: () => {
          setLocalChanges({});
        },
      },
    );
  };

  return (
    <div className="relative space-y-4 overflow-hidden">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/60 hover:bg-gray-50/60">
              <TableHead
                className={`${isArabic ? "text-right" : "text-left"} font-semibold text-gray-600 text-xs uppercase tracking-wider`}
              >
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.resource`,
                )}
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600 text-xs uppercase tracking-wider">
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.unit_price`,
                )}
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600 text-xs uppercase tracking-wider">
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.total`,
                )}
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600 text-xs uppercase tracking-wider">
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.requested`,
                )}
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600 text-xs uppercase tracking-wider min-w-35">
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.fulfillment`,
                )}
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600 text-xs uppercase tracking-wider">
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.delivered`,
                )}
              </TableHead>
              <TableHead
                className={`${isArabic ? "text-left" : "text-right"} font-semibold text-gray-600 text-xs uppercase tracking-wider`}
              >
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.status`,
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((r, idx) => {
              const currentDelivered =
                localChanges[r.itemId] !== undefined
                  ? localChanges[r.itemId]
                  : r.fulfilledQuantity;
              const done = currentDelivered >= r.quantity;
              const isEditing = localChanges[r.itemId] !== undefined;

              return (
                <motion.tr
                  key={r.itemId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${
                    isEditing ? "bg-amber-50/40" : ""
                  }`}
                >
                  {/* Item Name + Category */}
                  <TableCell
                    className={`${isArabic ? "text-right" : "text-left"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm leading-tight">
                          {r.itemName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {r.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Price per Unit */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-900 text-sm">
                        ${r.price.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        / {r.unit}
                      </span>
                    </div>
                  </TableCell>

                  {/* Total Amount */}
                  <TableCell className="text-center">
                    <span className="font-semibold text-gray-900 text-sm">
                      ${r.totalAmount.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 tabular-nums">
                      {r.quantity.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Fulfill Rate with Progress Bar */}
                  <TableCell className="text-center">
                    <Progress rate={r.fulfillRate} />
                  </TableCell>

                  {/* Fulfilled Quantity — Editable */}
                  <TableCell className="text-center">
                    <div className="relative inline-flex items-center">
                      <input
                        type="number"
                        min={0}
                        max={r.quantity}
                        value={currentDelivered}
                        onChange={(e) =>
                          handleQuantityChange(
                            r.itemId,
                            e.target.value,
                            r.quantity,
                          )
                        }
                        disabled={isPending}
                        className={`w-20 text-center text-sm font-semibold tabular-nums rounded-lg border-2 px-3 py-1.5 outline-none transition-all duration-200 ${
                          isEditing
                            ? "border-amber-400 bg-amber-50 text-amber-700 shadow-[0_0_0_3px_rgba(251,191,36,0.1)]"
                            : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-primary focus:shadow-[0_0_0_3px_rgba(170.46,100%,19.54%,0.1)]"
                        } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
                      />
                      {!isEditing && (
                        <Pencil className="absolute -right-1 -top-1 h-3 w-3 text-gray-300 pointer-events-none" />
                      )}
                    </div>
                  </TableCell>

                  {/* Item Status */}
                  <TableCell
                    className={`${isArabic ? "text-left" : "text-right"}`}
                  >
                    <OrderStatusBadge status={r.itemStatus} />
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {hasChanges && (
        <ConfrimChanges
          handleDiscard={handleDiscard}
          handleSave={handleSave}
          isSaving={isPending}
        />
      )}
    </div>
  );
};

export default ResourcesTable;
