import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "react-i18next";
import { OrderRequest } from "../api";
import { Button } from "@/components/ui/button";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { useParams } from "react-router";
import { useDeleteResource } from "../api/actions";

export default function OrdersTab({ orders }: { orders: OrderRequest[] }) {
  const { t } = useTranslation();
  const { siteId = "" } = useParams();
  const { mutate: deleteResourceOrder, isPending } = useDeleteResource();

  const confirmCancelOrder = (orderId: number | string) => {
    deleteResourceOrder({ siteId, resourceId: orderId });
  };

  return (
    <>
      {orders?.length === 0 || !orders ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          {t("resourceProvidor.workSites.orders.no-orders")}
        </div>
      ) : (
        <div className="space-y-3">
          {orders?.map((o) => (
            <motion.div
              key={o.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-border bg-card p-4 relative overflow-hidden group"
            >
              <img
                src={o.image}
                alt={o.name}
                className="h-20 w-20 rounded-lg object-cover bg-muted"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-semibold">{o.name}</h4>
                  <div className="space-x-2">
                    <Badge variant="outline" className="text-[12px]">
                      {t("resourceProvidor.workSites.orders.proposed", {
                        category: o.proposedCategory,
                      })}
                    </Badge>
                    {o.status === "pending" && (
                      <Badge className="bg-accent/15 text-accent border-accent/30">
                        {t("resourceProvidor.workSites.orders.status.pending")}
                      </Badge>
                    )}
                    {o.status === "approved" && (
                      <Badge className="bg-success/15 text-success border-success/30">
                        {t("resourceProvidor.workSites.orders.status.approved")}
                      </Badge>
                    )}
                    {o.status === "rejected" && (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/30">
                        {t("resourceProvidor.workSites.orders.status.rejected")}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {o.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("resourceProvidor.workSites.orders.requested_by")}
                  <span className="font-medium text-foreground mx-1">
                    {o.requestedBy}
                  </span>{" "}
                  · {o.requestedAt} · {o.quantity} {o.unitType}
                  {o.pricePerUnit.toFixed(2)}
                </p>
                <ConfirmDelete
                  openButton={
                    <Button
                      type="button"
                      variant="outline"
                      className="text-sm px-5 py-0 bg-black/20 hover:bg-red-400/20 text-white border-none hover:text-red-500 transition-all cursor-pointer absolute inset-0 h-full translate-y-100 group-hover:translate-y-0"
                    >
                      {t("resourceProvidor.workSites.btn-cancel", {
                        defaultValue: "Cancel",
                      })}
                    </Button>
                  }
                  onConfirm={() => confirmCancelOrder(o.id)}
                />
                {o.rejectionReason && (
                  <p className="text-xs text-destructive mt-1">
                    {t("resourceProvidor.workSites.orders.reason", {
                      reason: o.rejectionReason,
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
