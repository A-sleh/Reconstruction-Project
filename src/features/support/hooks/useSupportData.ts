import { useTranslation } from "react-i18next";
import type {
  KbCategory,
  KbFaq,
  KbSearchResult,
  SupportTicket,
  TicketThread,
} from "../api/types";

export interface SupportData {
  categories: KbCategory[];
  searchResults: KbSearchResult[];
  faqs: KbFaq[];
  tickets: SupportTicket[];
  threads: Record<string, TicketThread>;
}

export const useSupportData = (): SupportData => {
  const { t } = useTranslation();

  const categories = t("support.supportCenter.data.kb.categories", {
    returnObjects: true,
  }) as unknown as KbCategory[];

  const searchResults = t("support.supportCenter.data.kb.searchResults", {
    returnObjects: true,
  }) as unknown as KbSearchResult[];

  const faqs = t("support.supportCenter.data.kb.faqs", {
    returnObjects: true,
  }) as unknown as KbFaq[];

  const tickets = t("support.supportCenter.data.tickets", {
    returnObjects: true,
  }) as unknown as SupportTicket[];

  const threads = t("support.supportCenter.data.threads", {
    returnObjects: true,
  }) as unknown as Record<string, TicketThread>;

  const youName = t("support.supportCenter.data.youName") as string;
  const youInitial = t("support.supportCenter.data.youInitial") as string;

  return { categories, searchResults, faqs, tickets, threads, youName, youInitial };
};
