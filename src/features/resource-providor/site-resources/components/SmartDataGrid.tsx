import { useState, useEffect, useRef, useCallback } from "react";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
  Filter,
  X,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/Badge";
import { useBankCategories, useResourcesInfinite } from "../api/queries";
import { Label } from "@/components/ui/Label";

export interface OptionItem {
  id: number | string;
  name: string;
  categoryId?: number | string;
  description?: string;
  [key: string]: any;
}

interface DynamicAsyncSelectorProps {
  placeholder?: string;
  onSelect: (item: OptionItem | null) => void;
  value: OptionItem;
}

export function DynamicAsyncSelector({
  placeholder,
  onSelect,
  value,
}: DynamicAsyncSelectorProps) {
  console.log("value: ", value);
  const { t } = useTranslation();
  const placeholderText =
    placeholder ||
    t(
      "resourceProvidor.workSites.resource.dynamicSelector.placeholder",
      "Select an item...",
    );
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OptionItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );

  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useBankCategories();
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  const activeCategoryLabel = categories.find(
    (c: any) => c.id === selectedCategory,
  )?.name;

  useEffect(() => {
    if (value) {
      setSelectedItem(value);
    }else {
      setSelectedItem(null)
    }
  }, [value]);

  // ================= 2. تأخير البحث (Debounce) =================
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ================= 3. جلب الموارد (Infinite Scroll) =================
  const {
    data: resourcesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useResourcesInfinite({
    search: debouncedSearch,
    categoryId: selectedCategory,
  });

  const items = resourcesData?.pages.flatMap((page) => page.data) || [];

  // ================= مراقبة التمرير اللانهائي =================
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const handleClearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory("all");
    setShowSidebar(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setShowSidebar(false);
      }}
    >
      <PopoverTrigger asChild>
        <div>
          <Label className="">
            {t("resourceProvidor.workSites.resource.label-resource-type")}
          </Label>

          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-right bg-gray-100 border-gray-300 mt-1"
            dir="rtl"
          >
            {selectedItem ? selectedItem.name : placeholderText}
            <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-108 p-0 bg-white border-gray-300 overflow-hidden"
        align="start"
        dir="rtl"
      >
        <div className="flex h-95 relative">
          {/* ================= القائمة الجانبية للأصناف (Sidebar) ================= */}
          <div
            className={cn(
              "absolute inset-y-0 right-0 w-45 bg-gray-50 border-l border-gray-300 z-20 flex flex-col transition-transform duration-200 ease-in-out transform",
              showSidebar ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="p-2.5 border-b border-gray-400 flex items-center justify-between bg-gray-100/50">
              <span className="text-xs font-bold text-gray-700">
                {t(
                  "resourceProvidor.workSites.resource.dynamicSelector.filterByCategory",
                  "Filter by category",
                )}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-2 hover:bg-gray-300 rounded-md cursor-pointer"
                onClick={() => setShowSidebar(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div
              className="flex-1 overflow-y-auto p-1.5 space-y-1"
              style={{ scrollbarWidth: "none" }}
            >
              {isLoadingCategories ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <button
                    className={cn(
                      "w-full text-right px-2 py-1.5 text-xs rounded-sm transition-colors block",
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-gray-200 text-gray-700",
                    )}
                    onClick={() => {
                      setSelectedCategory("all");
                      setShowSidebar(false);
                    }}
                  >
                    {t(
                      "resourceProvidor.workSites.resource.dynamicSelector.all",
                      "All",
                    )}
                  </button>
                  {categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      className={cn(
                        "w-full text-right px-2 py-1.5 text-xs rounded-sm transition-colors block truncate",
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-gray-200 text-gray-700",
                      )}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowSidebar(false);
                      }}
                    >
                      {cat.name}{" "}
                      {/* تأكد أن حقل الاسم هنا يطابق الرد من السيرفر مثل cat.name أو cat.label */}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* ================= الواجهة الأساسية (Main Container) ================= */}
          <div className="flex-1 flex flex-col w-">
            {/* قسم 1: شريط المعلومات العلوي */}
            <div className="p-2 border-b border-gray-300 bg-gray-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-xs text-muted-foreground shrink-0">
                  الصنف:
                </span>
                {selectedCategory !== "all" ? (
                  <Badge
                    variant="default"
                    className="text-[11px] gap-1 px-2 py-0 truncate max-w-35"
                  >
                    {activeCategoryLabel}
                    <X
                      className="h-3 w-3 cursor-pointer hover:bg-gray-300 hover:text-primary transition-all rounded-full"
                      onClick={handleClearFilter}
                    />
                  </Badge>
                ) : (
                  <span className="text-xs font-medium text-gray-800">
                    {t(
                      "resourceProvidor.workSites.resource.dynamicSelector.all",
                      "All",
                    )}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs gap-1 border-gray-300 hover:bg-gray-200",
                    showSidebar && "bg-gray-100",
                  )}
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <Filter className="h-3 w-3" />
                  {t(
                    "resourceProvidor.workSites.resource.dynamicSelector.categories",
                    "Categories",
                  )}
                </Button>
              </div>
            </div>

            {/* قسم 2: حقل البحث الذكي */}
            <div className="flex items-center px-3 border-b border-gray-300 relative shrink-0">
              <Search className="h-4 w-4 shrink-0 opacity-50 ml-2" />
              <input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder={t(
                  "resourceProvidor.workSites.resource.dynamicSelector.searchPlaceholder",
                  "Type to search...",
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {isFetching && !isFetchingNextPage && (
                <Loader2 className="h-4 w-4 animate-spin text-primary absolute left-3" />
              )}
            </div>

            {/* قسم 3: قائمة العناصر مع التمرير اللانهائي */}
            <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
              {items.length === 0 && !isFetching && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {t(
                    "resourceProvidor.workSites.resource.dynamicSelector.noResults",
                    "No matching results.",
                  )}
                </div>
              )}

              {items.map((item: any, index: number) => {
                const isLastElement = index === items.length - 1;
                const isSelected = selectedItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    ref={isLastElement ? lastItemRef : null}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                      isSelected && "bg-accent/60 font-medium",
                    )}
                    onClick={() => {
                      setSelectedItem(item);
                      onSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 text-primary shrink-0",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col text-right w-full">
                      <span>{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-2 text-xs text-muted-foreground gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t(
                    "resourceProvidor.workSites.resource.dynamicSelector.loadingMore",
                    "Loading more...",
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
