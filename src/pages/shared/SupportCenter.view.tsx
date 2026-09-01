import { useState } from "react";
import { useTranslation } from "react-i18next";
import { successToast } from "@/components/common/Toast";
import CreateTicketSheet, {
  type NewTicketInput,
} from "@/features/support/components/CreateTicketSheet";
import KnowledgeBaseSection from "@/features/support/components/KnowledgeBaseSection";
import MyTicketsSection from "@/features/support/components/MyTicketsSection";
import SupportCenterHero from "@/features/support/components/SupportCenterHero";
import TicketThreadView from "@/features/support/components/TicketThreadView";
import type { SupportTicket, TicketThread } from "@/features/support/api/types";

let ticketCounter = 9000;

const SupportCenter = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const initialTickets = t("support.supportCenter.data.tickets", {
    returnObjects: true,
  }) as SupportTicket[];
  const initialThreads = t("support.supportCenter.data.threads", {
    returnObjects: true,
  }) as Record<string, TicketThread>;

  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [threads, setThreads] =
    useState<Record<string, TicketThread>>(initialThreads);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const activeThread = activeTicketId
    ? threads[activeTicketId] ?? null
    : null;

  const handleCreate = (data: NewTicketInput) => {
    const id = `TCK-${ticketCounter++}`;
    const now = new Date().toISOString().slice(0, 10);

    const newTicket: SupportTicket = {
      id,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: "open",
      createdAt: now,
      updatedAt: now,
      lastMessage: data.message,
      unread: false,
    };

    setTickets((prev) => [newTicket, ...prev]);
    setThreads((prev) => ({
      ...prev,
      [id]: {
        ticket_id: id,
        subject: data.subject,
        department: data.category,
        priority: data.priority,
        status: "open",
        can_rate: false,
        messages: [
          {
            id: 1,
            sender_type: "customer",
            sender_name: t("support.supportCenter.data.youName"),
            avatar_initial: t("support.supportCenter.data.youInitial"),
            content: data.message,
            created_at: now,
          },
        ],
      },
    }));
    setCreateOpen(false);
    successToast(t("support.supportCenter.createTicket.success"));
  };

  const handleSendMessage = (content: string) => {
    if (!activeTicketId) return;
    setThreads((prev) => {
      const thread = prev[activeTicketId];
      if (!thread) return prev;
      const nextId = thread.messages.length + 1;
      return {
        ...prev,
        [activeTicketId]: {
          ...thread,
          messages: [
            ...thread.messages,
            {
              id: nextId,
              sender_type: "customer",
              sender_name: t("support.supportCenter.data.youName"),
              avatar_initial: t("support.supportCenter.data.youInitial"),
              content,
              created_at: new Date().toISOString().slice(0, 10),
            },
          ],
        },
      };
    });
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicketId
          ? { ...t, lastMessage: content, updatedAt: new Date().toISOString().slice(0, 10) }
          : t,
      ),
    );
  };

  const handleRate = () => {
    if (!activeTicketId) return;
    setThreads((prev) => ({
      ...prev,
      [activeTicketId]: { ...prev[activeTicketId], can_rate: false },
    }));
    successToast(t("support.supportCenter.csat.thanks"));
  };

  return (
    <div className="space-y-6">
      <SupportCenterHero query={query} onQueryChange={setQuery} />

      {activeThread ? (
        <TicketThreadView
          thread={activeThread}
          onBack={() => setActiveTicketId(null)}
          onSendMessage={handleSendMessage}
          onRate={handleRate}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <KnowledgeBaseSection query={query} />
          </div>
          <div>
            <MyTicketsSection
              tickets={tickets}
              onOpenTicket={setActiveTicketId}
              onCreateTicket={() => setCreateOpen(true)}
            />
          </div>
        </div>
      )}

      <CreateTicketSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default SupportCenter;
