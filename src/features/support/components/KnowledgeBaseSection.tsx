import {
  BookOpen,
  CreditCard,
  HardHat,
  MapPin,
  Package,
  Search,
  Store,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { KbCategory, KbFaq, KbSearchResult } from "../api/types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  account: CreditCard,
  project: HardHat,
  order: Package,
  site: MapPin,
  market: Store,
  notify: BookOpen,
};

interface KnowledgeBaseSectionProps {
  query: string;
}

const KnowledgeBaseSection = ({ query }: KnowledgeBaseSectionProps) => {
  const { t } = useTranslation();
  const isSearching = query.trim().length > 0;

  const categories = t("support.supportCenter.data.kb.categories", {
    returnObjects: true,
  }) as KbCategory[];
  const searchResults = t("support.supportCenter.data.kb.searchResults", {
    returnObjects: true,
  }) as KbSearchResult[];
  const faqs = t("support.supportCenter.data.kb.faqs", {
    returnObjects: true,
  }) as KbFaq[];

  const results = searchResults.filter(
    (r) =>
      r.title.toLowerCase().includes(query.trim().toLowerCase()) ||
      r.snippet.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {t("support.supportCenter.kb.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("support.supportCenter.kb.description")}
        </p>
      </div>

      {isSearching ? (
        <div className="rounded-lg border border-gray-300 bg-white shadow-card">
          <div className="border-b border-gray-300 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Search className="h-4 w-4 text-primary" />
              {t("support.supportCenter.hero.searchButton")}
            </h3>
          </div>
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              {t("support.supportCenter.hero.noResults")}
            </p>
          ) : (
            <ul className="divide-y divide-gray-300">
              {results.map((result) => (
                <li key={result.article_id} className="px-4 py-3">
                  <span className="text-xs font-medium uppercase text-primary">
                    {result.category}
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-foreground">
                    {result.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.snippet}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon] ?? BookOpen;
            return (
              <div
                key={category.id}
                className="rounded-lg border border-gray-300 bg-white p-4 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-3 inline-block text-xs font-medium text-primary">
                  {category.articles_count}{" "}
                  {t("support.supportCenter.kb.viewAll")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-lg border border-gray-300 bg-white shadow-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("support.supportCenter.kb.popularTitle")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("support.supportCenter.kb.popularSubtitle")}
            </p>
          </div>
          <span className="hidden text-xs font-semibold text-primary sm:inline-block">
            {faqs.length}
          </span>
        </div>
        <Accordion type="single" collapsible className="px-0">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${faq.id}`}
              className="not-last:border-b not-last:border-gray-200"
            >
              <AccordionTrigger className="gap-3 px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/40 hover:no-underline data-[state=open]:bg-primary/5">
                <span className="flex min-w-0 items-center gap-3 text-start">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary transition-colors group-data-[state=open]/accordion-trigger:bg-primary group-data-[state=open]/accordion-trigger:text-primary-foreground">
                    {faq.id}
                  </span>
                  <span className="leading-snug">{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="ms-10 border-s-2 border-primary/20 ps-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default KnowledgeBaseSection;
