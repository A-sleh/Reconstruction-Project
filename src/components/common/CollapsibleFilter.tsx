import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface CollapsibleFilterProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function CollapsibleFilter({
  trigger,
  children,
  defaultOpen = false,
  className,
}: CollapsibleFilterProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("w-fit relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-gray-300  bg-white px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">{trigger}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-auto transition-all duration-200 ease-in-out absolute bg-white shadow-xl rounded-xl mt-2 z-50",
          isOpen ? "max-h-50 opacity-100" : "max-h-0 opacity-0",
          isArabic ? "max-sm:left-0" : " max-sm:right-0"
        )}
      >
        <div className="p-4 ">{children}</div>
      </div>
    </div>
  );
}
