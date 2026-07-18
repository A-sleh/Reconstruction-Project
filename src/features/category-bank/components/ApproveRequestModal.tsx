import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { MOCK_CATEGORIES } from "../mock/pendingRequests";

interface ApproveRequestModalProps {
  requestId: number | null;
  openButton: React.ReactNode;
  onConfirm: (assignedCategory: string) => void;
}

export function ApproveRequestModal({
  openButton,
  requestId,
  onConfirm,
}: ApproveRequestModalProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const OPEN_KEY = "approve-category-request" + requestId;

  const filteredCategories = MOCK_CATEGORIES.filter(
    (cat) =>
      cat.toLowerCase().includes(search.toLowerCase()) &&
      cat !== selectedCategory
  );

  const handleConfirm = () => {
    if (selectedCategory) {
      onConfirm(selectedCategory);
      setSelectedCategory(null);
      setSearch("");
    }
  };

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("categoryBank.approveModal.title", { defaultValue: "Approve & Assign Category" })}
      subTitle={t("categoryBank.approveModal.description", {
        defaultValue: "Assign this request to an existing category.",
      })}
      openButton={openButton}
    >
      <div className="space-y-4 my-4">
        {selectedCategory && (
          <div>
            <Label>
              {t("categoryBank.approveModal.assignedLabel", { defaultValue: "Assigned Category" })}
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 hover:text-primary/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="category-search">
            {t("categoryBank.approveModal.searchLabel", { defaultValue: "Search Categories" })}
          </Label>
          <div className="relative mt-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="category-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("categoryBank.approveModal.searchPlaceholder", {
                defaultValue: "Search by category name...",
              })}
              className="pr-9"
            />
          </div>
        </div>

        {search && (
          <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground text-center">
                {t("categoryBank.approveModal.noResults", { defaultValue: "No matching categories found." })}
              </p>
            ) : (
              filteredCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearch("");
                  }}
                  className="w-full text-right px-3 py-2 text-sm hover:bg-muted transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {cat}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
        <Button
          variant="default"
          disabled={!selectedCategory}
          onClick={handleConfirm}
        >
          {t("categoryBank.approveModal.actions.confirm", { defaultValue: "Approve & Assign" })}
        </Button>
      </div>
    </PopuupLayout>
  );
}
