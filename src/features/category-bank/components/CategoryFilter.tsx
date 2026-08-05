import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBankCategories } from "@/features/category-bank/api/quertes";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Layers } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BankItemType } from "../api/types";

interface CategoryFilterProps {
  value: number | "all";
  onValueChange: (value: number | "all") => void;
  className?: string;
  bankType?: BankItemType;
}

const SKELETON_COUNT = 4;

export default function CategoryFilter({
  value,
  onValueChange,
  className,
  bankType = "Resource",
}: CategoryFilterProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: categoriesData, isLoading } = useBankCategories({
    search: debouncedSearch || undefined,
    type: bankType,
  });

  const categories = categoriesData?.categories ?? [];
  const selectedCategory = categories.find((cat) => cat.id === value);
  console.log(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-foreground shadow-sm transition-colors hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            className,
          )}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <span className="flex items-center gap-2 truncate">
            <Layers className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">
              {selectedCategory?.name ??
                t(
                  "categoryBank.systemResources.allCategories",
                  "All Categories",
                )}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-72 p-2 space-y-2 bg-white border-gray-300 z-100"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="relative">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(
              "categoryBank.systemResources.searchCategoriesPlaceholder",
              "Search categories...",
            )}
            className="pl-9 w-full bg-white"
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
          <button
            type="button"
            onClick={() => {
              onValueChange("all");
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              value === "all"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-muted",
            )}
          >
            <span>
              {t(
                "categoryBank.systemResources.allCategories",
                "All Categories",
              )}
            </span>
            {value === "all" && <Check className="h-4 w-4 shrink-0" />}
          </button>

          {isLoading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))
          ) : categories.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              {t(
                "categoryBank.systemResources.table.empty",
                "No categories found.",
              )}
            </p>
          ) : (
            categories.map((cat) => {
              const isActive = value === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onValueChange(cat.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium border border-primary/30"
                      : "text-foreground hover:bg-muted border border-transparent",
                  )}
                >
                  <span className="truncate">{cat.name}</span>
                  {isActive && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
