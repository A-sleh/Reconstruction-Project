import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Inbox as InboxIcon,
  PanelLeft,
  PanelLeftClose,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import AdminStatsBar from "@/features/support/components/AdminStatsBar";
import TicketInboxPanel from "@/features/support/components/TicketInboxPanel";
import TicketWorkspacePanel from "@/features/support/components/TicketWorkspacePanel";
import CustomerInfoPanel from "@/features/support/components/CustomerInfoPanel";
import {
  mockAgentStats,
  mockAgentTickets,
  mockCannedResponses,
  mockTicketDetails,
} from "@/features/support/mock";
import type {
  AgentTicket,
  TicketDetails,
  TicketMessage,
} from "@/features/support/api/types";
import TicketStatusBadge from "@/features/support/components/TicketStatusBadge";
import TicketPriorityBadge from "@/features/support/components/TicketPriorityBadge";

const Support = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [activeView, setActiveView] = useState<"inbox" | "kb">("inbox");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [workTickets, setWorkTickets] =
    useState<Record<string, TicketDetails>>(buildTicketDetails);
  const [isRailOpen, setIsRailOpen] = useState(true);
  const [kbQuery, setKbQuery] = useState("");

  const detailMap = workTickets;

  const selectedTicket = detailMap[selectedTicketId ?? ""] ?? null;

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveView("inbox");
  };

  const handleSendMessage = (content: string, isInternal: boolean) => {
    if (!selectedTicket) return;
    setWorkTickets((prev) => {
      const ticket = prev[selectedTicket.ticket_id];
      const nextId = ticket.messages.length + 1;
      const message: TicketMessage = {
        id: nextId,
        sender_type: "agent",
        sender_name: "أحمد علي",
        content,
        is_internal_note: isInternal,
        created_at: new Date().toISOString(),
      };
      return {
        ...prev,
        [selectedTicket.ticket_id]: {
          ...ticket,
          messages: [...ticket.messages, message],
        },
      };
    });
  };

  const cannedResponses = mockCannedResponses.map((c) => ({
    id: c.id,
    title: c.title,
    content: c.content,
  }));

  return (
    <div
      className="min-h-screen bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="container py-6 space-y-6">
        <header className="flex items-center justify-between gap-3 rounded-xl border border-gray-300 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
              {t("support.agent.inbox.badge")}
            </span>
            <h1 className="text-sm font-bold text-foreground">
              {t("support.agent.inbox.title")}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {t("support.agent.inbox.online", { name: "أحمد علي" })}
            </span>
          </div>
        </header>

        <Tabs
          value={activeView}
          onValueChange={(v) => setActiveView(v as "inbox" | "kb")}
          className="space-y-6"
        >
          <TabsList className="w-fit">
            <TabsTrigger value="inbox" className="gap-2">
              <InboxIcon className="size-4" />
              {t("support.agent.inbox.title")}
            </TabsTrigger>
            <TabsTrigger value="kb" className="gap-2">
              <BookOpen className="size-4" />
              {t("support.supportCenter.kb.title")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-0 space-y-6">
            {selectedTicket ? (
              <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
                <div
                  className={cn(
                    "flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-card transition-all",
                    isRailOpen ? "w-full lg:w-72" : "w-12",
                  )}
                >
                  <div className="flex items-center justify-between border-b border-gray-300 p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsRailOpen((o) => !o)}
                      className="size-8"
                    >
                      {isRailOpen ? (
                        <PanelLeftClose className="size-4" />
                      ) : (
                        <PanelLeft className="size-4" />
                      )}
                    </Button>
                    {isRailOpen && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTicketId(null)}
                      >
                        {t("support.agent.workspace.back", "Back to inbox")}
                      </Button>
                    )}
                  </div>
                  {isRailOpen && (
                    <div className="flex-1 overflow-y-auto">
                      {mockAgentTickets.map((ticket) => (
                        <button
                          key={ticket.ticket_id}
                          type="button"
                          onClick={() => setSelectedTicketId(ticket.ticket_id)}
                          className={cn(
                            "flex w-full flex-col gap-1 border-b border-gray-300 px-3 py-3 text-start transition-colors hover:bg-muted/50",
                            selectedTicketId === ticket.ticket_id &&
                              "bg-primary/5",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-foreground">
                              #{ticket.ticket_id}
                            </span>
                            <TicketPriorityBadge priority={ticket.priority} />
                          </div>
                          <span className="truncate text-sm font-semibold text-foreground">
                            {ticket.subject}
                          </span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs text-muted-foreground">
                              {ticket.customer_name}
                            </span>
                            <TicketStatusBadge status={ticket.status} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <TicketWorkspacePanel
                  details={selectedTicket}
                  cannedResponses={cannedResponses}
                  onSendMessage={handleSendMessage}
                />

                {selectedTicket.customer && (
                  <CustomerInfoPanel customer={selectedTicket.customer} />
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <AdminStatsBar stats={mockAgentStats} />
                <TicketInboxPanel
                  tickets={mockAgentTickets}
                  total={mockAgentTickets.length}
                  onOpenTicket={handleSelectTicket}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="kb" className="mt-0 space-y-6">
            <KnowledgeBaseContent
              query={kbQuery}
              onQueryChange={setKbQuery}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const buildTicketDetails = (): Record<string, TicketDetails> => {
  return mockAgentTickets.reduce<Record<string, TicketDetails>>(
    (acc, ticket) => {
      acc[ticket.ticket_id] = toDetails(ticket);
      return acc;
    },
    {},
  );
};

const toDetails = (ticket: AgentTicket): TicketDetails => {
  const base =
    ticket.ticket_id === mockTicketDetails.ticket_id
      ? mockTicketDetails
      : null;

  return {
    ticket_id: ticket.ticket_id,
    subject: ticket.subject,
    department: ticket.customer_role,
    status: ticket.status,
    priority: ticket.priority,
    customer: base?.customer ?? {
      id: ticket.ticket_id,
      name: ticket.customer_name,
      role: ticket.customer_role,
      email: `${ticket.ticket_id.toLowerCase()}@example.com`,
      join_date: "2025-01-01",
      previous_tickets_count: 0,
    },
    messages:
      base?.messages ?? [
        {
          id: 1,
          sender_type: "customer",
          sender_name: ticket.customer_name,
          content: ticket.subject,
          is_internal_note: false,
          created_at: "2026-08-11T10:30:00Z",
        },
      ],
  };
};

const KnowledgeBaseContent = ({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) => {
  const { t } = useTranslation();
  const categories = t("support.supportCenter.data.kb.categories", {
    returnObjects: true,
  }) as Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    articles_count: number;
  }>;
  const faqs = t("support.supportCenter.data.kb.faqs", {
    returnObjects: true,
  }) as Array<{ id: number; question: string; answer: string }>;
  const searchResults = t("support.supportCenter.data.kb.searchResults", {
    returnObjects: true,
  }) as Array<{
    article_id: number;
    category: string;
    title: string;
    snippet: string;
  }>;

  const results = searchResults.filter(
    (r) =>
      r.title.toLowerCase().includes(query.trim().toLowerCase()) ||
      r.snippet.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-card">
        <h2 className="text-lg font-bold text-foreground">
          {t("support.supportCenter.kb.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("support.supportCenter.kb.description")}
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("support.supportCenter.hero.searchPlaceholder")}
          className="ps-9"
        />
      </div>

      {query.trim() ? (
        <div className="rounded-lg border border-gray-300 bg-white shadow-card">
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
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-gray-300 bg-white p-4 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="text-sm font-semibold text-foreground">
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
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("support.supportCenter.kb.popularTitle")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("support.supportCenter.kb.popularSubtitle")}
            </p>
          </div>
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

export default Support;
