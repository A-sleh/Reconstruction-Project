import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useResourceTags, useServiceTags } from "../api/quertes";
import { Tag } from "../api/types";

interface TagSearchInputProps {
  type: "resource" | "service";
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}

export default function TagSearchInput({
  type,
  selectedTags,
  onTagsChange,
  placeholder,
}: TagSearchInputProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: suggestions } = useResourceTags(debouncedQuery);
  const { data: serviceSuggestions } = useServiceTags(debouncedQuery);

  const results = type === "resource" ? suggestions : serviceSuggestions;
  const filtered = (results ?? []).filter(
    (tag) => !selectedTags.some((st) => st.id === tag.id),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setQuery("");
    setOpen(false);
  };

  const removeTag = (tagId: number) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      const existing = selectedTags.find(
        (t) => t.name.toLowerCase() === query.trim().toLowerCase(),
      );
      if (!existing) {
        addTag({ id: Date.now(), name: query.trim() });
      }
      e.preventDefault();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg bg-white min-h-[42px] focus-within:border-gray-400 transition-colors">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="hover:text-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            t("categoryBank.tagsModal.placeholder", "Search or add tags...")
          }
          className="flex-1 min-w-[120px] border-0  h-7 text-sm shadow-none focus-visible:ring-0 p-1 py-4"
        />
      </div>

      {open && debouncedQuery.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {t("categoryBank.tagsModal.noTags", "No matching tags")}
            </div>
          ) : (
            filtered.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag)}
                className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span>{tag.name}</span>
                <span className="text-xs text-muted-foreground">
                  ID: {tag.id}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
