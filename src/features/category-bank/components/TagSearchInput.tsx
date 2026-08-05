import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useResourceTags, useServiceTags } from "../api/quertes";

interface TagSearchInputProps {
  type: "resource" | "service";
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
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
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    data: suggestions,
    fetchNextPage: fetchNextTags,
    hasNextPage: hasMoreTags,
    isFetchingNextPage: isFetchingMoreTags,
  } = useResourceTags(debouncedQuery);
  const {
    data: serviceSuggestions,
    fetchNextPage: fetchNextServiceTags,
    hasNextPage: hasMoreServiceTags,
    isFetchingNextPage: isFetchingMoreServiceTags,
  } = useServiceTags(debouncedQuery);

  const isResource = type === "resource";
  const results = isResource ? suggestions : serviceSuggestions;
  const hasMore = isResource ? hasMoreTags : hasMoreServiceTags;
  const isLoadingMore = isResource
    ? isFetchingMoreTags
    : isFetchingMoreServiceTags;
  const loadMore = isResource ? fetchNextTags : fetchNextServiceTags;

  const tags = results?.pages.flatMap((page) => page.data) ?? [];
  const filtered = tags.filter(
    (tag) => !selectedTags.some((st) => st === tag.name),
  );

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoadingMore, hasMore, loadMore],
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

  const addTag = (tag: string) => {
    onTagsChange([...selectedTags, tag]);
    setQuery("");
    setOpen(false);
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      const existing = selectedTags.find(
        (t) => t.toLowerCase() === query.trim().toLowerCase(),
      );
      if (!existing) {
        addTag(query.trim());
      }
      e.preventDefault();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg bg-white min-h-[42px] focus-within:border-gray-400 transition-colors">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
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
            <div>
              {filtered.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => addTag(tag.name)}
                  className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span>{tag.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ID: {tag.id}
                  </span>
                </button>
              ))}
              <div ref={lastItemRef} className="h-px" />
              {isLoadingMore && (
                <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                  {t("categoryBank.tagsModal.loading", "Loading...")}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
