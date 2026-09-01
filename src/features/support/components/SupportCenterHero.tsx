import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

interface SupportCenterHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
}

const SupportCenterHero = ({ query, onQueryChange }: SupportCenterHeroProps) => {
  const { t } = useTranslation();

  return (
    <section className="gradient-primary rounded-lg px-6 py-12 text-white shadow-card">
      <div className="max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold">
          {t("support.supportCenter.hero.title")}
        </h1>
        <p className="mt-2 text-sm opacity-90">
          {t("support.supportCenter.hero.subtitle")}
        </p>

        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t("support.supportCenter.hero.searchPlaceholder")}
            className="h-12 rounded-md border-0 bg-white pl-10 pr-4 text-foreground shadow-card focus-visible:ring-accent"
          />
        </div>
      </div>
    </section>
  );
};

export default SupportCenterHero;
