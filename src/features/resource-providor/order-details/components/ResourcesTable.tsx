import { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { RequestedResource } from "../../orders/api";
import ConfrimChanges from "@/components/common/ConfrimChanges";
import { useUpdateOrderItemsQuantity } from "../api/actions";
import { useParams } from "react-router";

interface ResourcesTableProps {
  resources: RequestedResource[];
}

const ResourcesTable = ({ resources }: ResourcesTableProps) => {
  const { orderId = "" } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { mutate: updateItemsQuantity, isPending } =
    useUpdateOrderItemsQuantity();

  // State to track temporary local changes: { [resourceId]: updatedQuantity }
  const [localChanges, setLocalChanges] = useState<Record<string, number>>({});
  const hasChanges = Object.keys(localChanges).length > 0;

  // Handles input value changes local to the row item
  const handleQuantityChange = (id: string, value: string, max: number) => {
    const parsedValue = parseInt(value, 10);

    // Fallback if empty string or invalid number input
    if (isNaN(parsedValue)) {
      setLocalChanges((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      return;
    }

    // Clamp the input value within valid bounds [0, max]
    const clampedValue = Math.max(0, Math.min(parsedValue, max));
    const originalResource = resources.find((r) => r.id === id);

    if (originalResource && originalResource.delivered === clampedValue) {
      // If the value returned back to original value, remove tracking item
      setLocalChanges((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      // Store current modified state value
      setLocalChanges((prev) => ({ ...prev, [id]: clampedValue }));
    }
  };

  const handleDiscard = () => {
    setLocalChanges({});
  };

  const handleSave = async () => {
    updateItemsQuantity(
      { orderId, payload: localChanges },
      {
        onSuccess: () => {
          setLocalChanges({});
        },
      },
    );
  };

  return (
    <div className="relative space-y-4  overflow-hidden">
      <div className="rounded-xl border border-gray-300 bg-white">
        <Table>
          <TableHeader>
            <TableRow className={isArabic ? "text-right" : "text-left"}>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.resource`,
                )}
              </TableHead>
              <TableHead className="text-center">
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.requested`,
                )}
              </TableHead>
              <TableHead className="text-center">
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.delivered`,
                )}
              </TableHead>
              <TableHead className={isArabic ? "text-left" : "text-right"}>
                {t(
                  `resourceProvidor.investor-request-details.resources_table.columns.status`,
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((r) => {
              // Read current displayed value either from modified state or backend database value
              const currentDelivered =
                localChanges[r.id] !== undefined
                  ? localChanges[r.id]
                  : r.delivered;
              const done = currentDelivered >= r.quantity;

              return (
                <TableRow key={r.id}>
                  <TableCell
                    className={`font-medium ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {r.name}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {r.quantity}
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min={0}
                      max={r.quantity}
                      value={currentDelivered}
                      className={`w-24 mx-auto text-center rounded-lg transition-all ${
                        localChanges[r.id] !== undefined
                          ? "border-warning bg-warning/5 font-semibold text-warning"
                          : ""
                      }`}
                      onChange={(e) =>
                        handleQuantityChange(r.id, e.target.value, r.quantity)
                      }
                      disabled={isPending}
                    />
                  </TableCell>
                  <TableCell className={isArabic ? "text-left" : "text-right"}>
                    <span
                      className={`text-xs font-medium ${done ? "text-success" : "text-warning"}`}
                    >
                      {done
                        ? t(
                            `resourceProvidor.investor-request-details.resources_table.status_labels.delivered`,
                          )
                        : t(
                            `resourceProvidor.investor-request-details.resources_table.status_labels.in_progress`,
                          )}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Persistent Inline Confirmation Banner UI State */}
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
