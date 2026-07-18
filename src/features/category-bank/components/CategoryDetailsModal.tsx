import { useTranslation } from "react-i18next";
import { Calendar, Hash, Tag } from "lucide-react";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { SystemCategory } from "../mock/categories";

interface CategoryDetailsModalProps {
  category: SystemCategory | null;
  openButton: React.ReactNode;
}

export function CategoryDetailsModal({
  category,
  openButton,
}: CategoryDetailsModalProps) {
  const { t } = useTranslation();
  const OPEN_KEY = "category-details-" + category?.id;

  if (!category) return null;

  const isResource = category.type === "resource";

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("categoryBank.detailsModal.title", {
        defaultValue: "Category Details",
      })}
      subTitle={category.name}
      openButton={openButton}
    >
      <div className="flex flex-col gap-5 my-4">
        {/* Hero: name + type */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-foreground leading-tight">
            {category.name}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
              isResource
                ? "bg-emerald-soft text-emerald border border-emerald/20"
                : "bg-primary/10 text-primary-foreground border border-primary/20"
            }`}
            style={!isResource ? { backgroundColor: "hsl(170.46deg 100% 19.54% / 12%)", color: "hsl(170.46deg 100% 25%)" } : undefined}
          >
            {isResource
              ? t("categoryBank.table.resource", "Resource")
              : t("categoryBank.table.service", "Service")}
          </span>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            <Hash className="h-3 w-3" />
            {t("categoryBank.detailsModal.usageCount", {
              defaultValue: "Usage",
            })}
            <span className="text-foreground font-semibold">
              {category.usageCount}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            <Calendar className="h-3 w-3" />
            {new Date(category.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Description block */}
        <div className="rounded-lg border border-l-2 border-l-primary border-border bg-muted/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("categoryBank.detailsModal.description", {
              defaultValue: "Description",
            })}
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("categoryBank.detailsModal.tags", { defaultValue: "Tags" })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.tags.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                {t("categoryBank.detailsModal.noTags", {
                  defaultValue: "No tags assigned",
                })}
              </p>
            ) : (
              category.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium border border-border"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </PopuupLayout>
  );
}
