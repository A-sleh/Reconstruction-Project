import { useTranslation } from "react-i18next";
import { Hash, Tag } from "lucide-react";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { PureResource } from "../api/types";

interface ResourceDetailsModalProps {
  resource: PureResource;
  openButton: React.ReactNode;
}

export function ResourceDetailsModal({
  resource,
  openButton,
}: ResourceDetailsModalProps) {
  const { t } = useTranslation();
  const OPEN_KEY = "resource-details-" + resource.id;

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("categoryBank.detailsModal.resourceTitle", {
        defaultValue: "Resource Details",
      })}
      subTitle={resource.name}
      openButton={openButton}
    >
      <div className="flex flex-col gap-5 my-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-foreground leading-tight">
            {resource.name}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-soft text-emerald border border-emerald/20">
            {resource.category?.name || "—"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            <Hash className="h-3 w-3" />
            ID: {resource.id}
          </span>
          {resource.price > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              ${resource.price} / {resource.unit}
            </span>
          )}
        </div>

        <div className="rounded-lg border border-l-2 border-l-primary border-border bg-muted/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("categoryBank.detailsModal.description", {
              defaultValue: "Description",
            })}
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {resource.description}
          </p>
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <>
            <div className="h-px bg-border" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("categoryBank.detailsModal.tags", { defaultValue: "Tags" })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium border border-border"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PopuupLayout>
  );
}
