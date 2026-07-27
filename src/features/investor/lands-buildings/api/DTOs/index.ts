import { parsingTheStringToEnum } from "@/lib/helpers";
import { Attachment, EZoningType, LandDetail, ZONING_LABELS } from "../types";

export function buildUpdatePayload(
  land: LandDetail,
  attachments: Attachment[],
) {
  const zoningValue = parsingTheStringToEnum<EZoningType>(ZONING_LABELS,land.zoningType);
  
  return {
    id: String(land.landId),
    name: land.name,
    address: land.address,
    location: `${land.location.latitude},${land.location.longitude}`,
    area: land.area,
    zoning: zoningValue,
    border: land.border.map((b) => `${b.latitude},${b.longitude}`),
    isValidated: land.isValidated,
    accessability: land.accessability,
    coverImageId: land.coverImageUrl ?? "",
    attachments,
  };
}