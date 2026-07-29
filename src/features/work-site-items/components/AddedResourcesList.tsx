import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Resource } from "../api/actions";

type LocalResource = Resource & { id: string };

interface Props {
  rolePrefix: string;
  resources: LocalResource[];
  selectedId: string | null;
  onResourceClick: (resource: LocalResource) => void;
  onRemove: (id: string) => void;
}

export function AddedResourcesList({
  rolePrefix,
  resources,
  selectedId,
  onResourceClick,
  onRemove,
}: Props) {
  const { t } = useTranslation();

  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm w-[30%]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            {t(`${rolePrefix}.addResources.added-resources`, {
              count: resources.length,
            })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(`${rolePrefix}.addResources.select-to-edit`)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-5 text-sm text-muted-foreground">
            {t(`${rolePrefix}.addResources.no-added-resources`)}
          </div>
        ) : (
          resources.map((resource) => (
            <button
              key={resource.id}
              type="button"
              onClick={() => onResourceClick(resource)}
              className={`w-full rounded-xl border p-4 text-left transition-all hover:border-primary ${
                resource.id === selectedId
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex justify-between items-center gap-3">
                <div className="flex flex-col gap-1 items-start">
                  <div className="min-w-0 flex flex-col items-start">
                    <p className="flex flex-col font-semibold truncate items-start">
                      {resource.resourceBank.name}
                      <span className="text-[10px] text-gray-600 p-1 px-2 rounded-full bg-gray-600/20">
                        {resource.resourceBank.category.name}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-500 text-sm w-60 truncate">
                      {resource.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {t(`${rolePrefix}.form.label-price-per-unit`)}:{" "}
                      {resource.price.toFixed(2)} {resource.unit}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemove(resource.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-muted-foreground transition hover:border-destructive hover:text-destructive"
                  aria-label={t(`${rolePrefix}.addResources.remove-resource`)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
