import { Boxes, Eye, Layers, MapPin, User, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import AddCartPopup from "@/features/cart/components/AddCartPopup";
import type { PureResource } from "@/features/category-bank/api/types";
import { ResourceDetailsModal } from "@/features/category-bank/components/ResourceDetailsModal";
import { getDominImageURL } from "@/lib/helpers";
import { IImage } from "@/types";

/** Minimal fields ShopCard needs to render an item */
export interface ShopItemFields {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  isAvailable: boolean;
  image: IImage;
  itemType: "Resource" | "Service";
  categoryName: string;
  providerName: string;
  workSiteName: string;
  tags?: string[];
}

interface ShopCardProps<T extends ShopItemFields> {
  item: T;
  projectId?: number;
  /** Maps the generic item to the shape required by the details modal */
  getResourceDetails?: (item: T) => PureResource;
}

function ShopCard<T extends ShopItemFields>({
  item,
  projectId,
  getResourceDetails,
}: ShopCardProps<T>) {
  const { t } = useTranslation();
  const isResource = item.itemType === "Resource";
  const detailsResource = getResourceDetails?.(item);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative h-44 overflow-hidden bg-muted">
        {item?.image ? (
          <img
            src={getDominImageURL(item.image?.url)}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
            {isResource ? (
              <Boxes className="h-12 w-12 text-primary/40" />
            ) : (
              <Wrench className="h-12 w-12 text-primary/40" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
              isResource ? "bg-amber-500" : "bg-sky-600"
            }`}
          >
            {isResource ? (
              <Boxes className="h-3 w-3" />
            ) : (
              <Wrench className="h-3 w-3" />
            )}
            {isResource
              ? t("workSiteItems.allProvidorItems.resource", "Resource")
              : t("workSiteItems.allProvidorItems.service", "Service")}
          </span>
        </div>

        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          {projectId !== undefined && (
            <AddCartPopup item={{ ...item, projectId }} projectId={projectId} />
          )}
          {detailsResource && (
            <ResourceDetailsModal
              resource={detailsResource}
              openButton={
                <button
                  type="button"
                  title={t(
                    "workSiteItems.shopCard.viewDetails",
                    "View details",
                  )}
                  className="rounded-full bg-white/90 p-2 text-foreground shadow-sm backdrop-blur transition-smooth hover:bg-white hover:text-primary"
                >
                  <Eye className="h-4 w-4" />
                </button>
              }
            />
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-lg font-semibold leading-tight drop-shadow">
            {item.name}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-white/85">
            <Layers className="h-3 w-3" />
            {item.categoryName}
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">
              {t("categoryBank.systemResources.table.id", "Price")}
            </div>
            <div className="text-lg font-semibold text-primary">
              {item.price.toLocaleString()}
              {item.unit && (
                <span className="text-sm font-medium text-muted-foreground">
                  {t("workSiteItems.allProvidorItems.perUnit", "/ {{unit}}", {
                    unit: item.unit,
                  })}
                </span>
              )}
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              item.isAvailable
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-gray-500/10 text-gray-600"
            }`}
          >
            {item.isAvailable
              ? t("workSiteItems.allProvidorItems.available", "Available")
              : t("workSiteItems.allProvidorItems.unavailable", "Unavailable")}
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {item.providerName}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {item.workSiteName}
          </div>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ShopCard;
