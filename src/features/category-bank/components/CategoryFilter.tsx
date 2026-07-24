import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBankCategories } from "@/features/category-bank/api/quertes";

interface CategoryFilterProps {
  value: number | "all";
  onValueChange: (value: number | "all") => void;
  className?: string;
}

export default function CategoryFilter({
  value,
  onValueChange,
  className,
}: CategoryFilterProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { data: categoriesData, isLoading } = useBankCategories();

  const categories = categoriesData?.categories ?? [];

  return (
    <Select
      value={value === "all" ? "all" : String(value)}
      onValueChange={(v) =>
        onValueChange(v === "all" ? "all" : Number(v))
      }
    >
      <SelectTrigger className={className} dir={isArabic ? "rtl" : "ltr"}>
        <SelectValue
          placeholder={t(
            "categoryBank.systemResources.filterByCategory",
            "Filter by category",
          )}
        />
      </SelectTrigger>
      <SelectContent dir={isArabic ? "rtl" : "ltr"}>
        <SelectItem value="all">
          {t("categoryBank.systemResources.allCategories", "All Categories")}
        </SelectItem>
        {isLoading ? (
          <SelectItem value="__loading" disabled>
            {t("common.loading", "Loading...")}
          </SelectItem>
        ) : (
          categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
