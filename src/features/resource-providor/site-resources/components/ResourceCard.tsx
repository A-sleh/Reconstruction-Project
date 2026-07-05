import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "./StatusBadge";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { useTranslation } from "react-i18next";

import { Resource, useDeleteResource } from "../api/actions";
import { useParams } from "react-router";
import ModifyResourceModel from "./ModifyResourceModel";

interface Props {
  resource: Resource;
}

export default function ResourceCard({ resource }: Props) {
  const { t } = useTranslation();
  const { siteId = "" } = useParams();
  const { mutate: deleteResource } = useDeleteResource();

  function handleConfirmeDelete() {
    deleteResource(Number(resource?.id));
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-2xl  overflow-hidden bg-white shadow-sm hover:shadow-elegant transition-smooth flex flex-col"
    >
      <div className="relative aspect-16/10 bg-muted overflow-hidden">
        <img
          src={resource.imageUrl}
          alt={resource.description}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="destructive">{resource?.category?.name}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={resource.isAvailable ? "active" : "on-hold"} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground line-clamp-1">
          {resource.resourceBank?.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-10">
          {resource.description}
        </p>

        <div className="mt-4 flex justify-around gap-3 text-sm border-t border-gray-300 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t(
                "resourceProvidor.workSites.resource.card.price_per_unit",
                "Price / unit",
              )}
            </p>
            <p className="font-semibold text-primary tabular-nums">
              ${resource.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("resourceProvidor.workSites.resource.card.unit", "Unit")}
            </p>
            <p className="font-semibold tabular-nums">{resource.unit}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-300">
          <div className="flex gap-1">
            <ConfirmDelete
              item={resource.description}
              onConfirm={handleConfirmeDelete}
              openButton={
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <ModifyResourceModel
              openButton={
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-sky-300"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  aria-label={t(
                    "resourceProvidor.workSites.btn-edit",
                    "Edit site",
                  )}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
              initial={resource}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
