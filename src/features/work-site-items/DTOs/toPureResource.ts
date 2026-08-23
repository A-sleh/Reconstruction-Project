import { AvailableItem } from "../api/types";
import type { PureResource } from "@/features/category-bank/api/types";

export const toPureResource = (item: AvailableItem): PureResource =>
  ({
    id: item.id,
    name: item.name,
    imageURL: item.imageUrl,
    description: item.description,
    price: item.price,
    unit: item.unit,
    isAvailable: item.isAvailable,
    category: {
      id: item.categoryId,
      name: item.categoryName,
      categoryType: item.itemType,
    },
    tags: item.tags,
  }) as PureResource;
