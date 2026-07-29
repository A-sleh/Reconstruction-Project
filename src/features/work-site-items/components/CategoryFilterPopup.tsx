import { Filter } from "lucide-react";
import PopuupLayout from "@/components/layouts/Popup-layout";
import useQueryStringState from "@/hooks/useQueryStringState";
import { useBankCategories } from "@/features/category-bank/api/quertes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const OPEN_KEY = "category-filter";

const CategoryFilterPopup = ({
  onSelect,
}: {
  onSelect: (key: string) => void;
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useQueryStringState<
    number | undefined
  >("ResourceCategoryId", undefined);
  const { data: categoriesData } = useBankCategories();
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  const handleCategoryChange = (
    value: any,
    closeModel: () => void,
  ) => {
    closeModel();
    setSelectedCategory(value);
    onSelect(value);
  };

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("workSites.filters.categoryFilterTitle", "Choose a category")}
      subTitle={t(
        "workSites.filters.categoryFilterDescription",
        "Select a category to narrow the inventory list.",
      )}
      openButton={
        <Button
          type="button"
          variant="outline"
          className="h-10 w-10 p-0 bg-white border-gray-300"
          aria-label={t("workSites.filters.open", "Filter categories")}
        >
          <Filter className="h-4 w-4" />
        </Button>
      }
    >
      {(closeModel) => (
        <div>
          <span className="text-xs text-muted-foreground block mb-4">
            {categories.length}{" "}
            {t("workSites.filters.availableCategories", "categories available")}
          </span>

          <div
            className="max-h-100 overflow-auto grid md:grid-cols-3 lg:grid-cols-3 gap-2"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => handleCategoryChange("all", closeModel)}
              className={`w-full text-center px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 transition-all ${
                selectedCategory
                  ? "bg-card border-border text-muted-foreground hover:text-foreground"
                  : "bg-primary text-primary-foreground border-primary"
              }`}
            >
              {t("workSites.filters.all")}
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id, closeModel)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-center text-nowrap transition-all ${
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
            <Button
              type="button"
              variant="ghost"
              className="bg-red-400 text-white hover:opacity-80"
              onClick={closeModel}
            >
              {t("workSites.btn-cancel", "Cancel")}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
};

export default CategoryFilterPopup;
