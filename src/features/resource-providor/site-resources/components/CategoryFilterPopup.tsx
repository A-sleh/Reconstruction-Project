import { Filter, X } from "lucide-react";
import Model from "@/components/model/Model";
import useQueryStringState from "@/hooks/useQueryStringState";
import { useBankCategories } from "../api/queries";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const OPEN_KEY = "category-filter";

const CategoryFilterPopup = ({
  onSelect,
}: {
  onSelect: (key: string) => void;
}) => {
  const { t } = useTranslation();
  const closeRef = useRef<null | HTMLButtonElement>(null);
  const [selectedCategory, setSelectedCategory] = useQueryStringState<
    number | undefined
  >("ResourceCategoryId", undefined);
  const { data: categoriesData } = useBankCategories();
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  const handleCategoryChange = (value: any) => {
    closeRef.current?.click();
    setSelectedCategory(value);
    onSelect(value);
  };

  return (
    <Model>
      <Model.Open opens={OPEN_KEY}>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-10 p-0 bg-white border-gray-300"
          aria-label={t(
            "resourceProvidor.workSites.filters.open",
            "Filter categories",
          )}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </Model.Open>

      <Model.Window name={OPEN_KEY}>
        <div className="">
          <div className="mb-4 flex items-start justify-between gap-4 border-b pb-2 border-gray-300">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">
                {t(
                  "resourceProvidor.workSites.filters.categoryFilterTitle",
                  "Choose a category",
                )}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t(
                  "resourceProvidor.workSites.filters.categoryFilterDescription",
                  "Select a category to narrow the inventory list.",
                )}
              </p>
              <span className="text-xs text-muted-foreground mt-2 block">
                {categories.length}{" "}
                {t(
                  "resourceProvidor.workSites.filters.availableCategories",
                  "categories available",
                )}
              </span>
            </div>
            <Model.Close>
              <Button
                ref={closeRef}
                type="button"
                variant="ghost"
                className="h-9 w-9 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t("common.close", "Close")}
              >
                <X className="h-4 w-4" />
              </Button>
            </Model.Close>
          </div>

          <div
            className="space-y-2 max-h-100 overflow-auto grid md:grid-cols-3 lg:grid-cols-3 gap-2"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => handleCategoryChange(undefined)}
              className={`w-full text-center px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 transition-all ${
                selectedCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("resourceProvidor.workSites.filters.all")}
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full  px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-center text-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Model.Close>
              <Button
                type="button"
                variant="ghost"
                className="bg-red-400 text-white hover:opacity-80"
              >
                {t("resourceProvidor.workSites.btn-cancel", "Cancel")}
              </Button>
            </Model.Close>
          </div>
        </div>
      </Model.Window>
    </Model>
  );
};

export default CategoryFilterPopup;
