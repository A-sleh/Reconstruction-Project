import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessagesSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversations } from "../api/queries";
import { useSendMessage } from "../api/actions";
import type { ChatMessage, Conversation, SystemUser } from "../api/types";
import ConversationList from "./ConversationList";
import ChatThreadPanel from "./ChatThreadPanel";
import StartConversationModal from "./StartConversationModal";

const ConversationsView = () => {
  const { t } = useTranslation();
  const { data: conversations, isLoading } = useConversations();
  const sendMessage = useSendMessage();

  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [created, setCreated] = useState<Conversation[]>([]);
  const [pendingMessages, setPendingMessages] = useState<
    Record<number, ChatMessage[]>
  >({});
  const [modalOpen, setModalOpen] = useState(false);

  const allConversations = useMemo(() => {
    return [...created, ...(conversations ?? [])].sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
    );
  }, [created, conversations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allConversations;
    return allConversations.filter(
      (c) =>
        `${c.participant.firstName} ${c.participant.lastName}`
          .toLowerCase()
          .includes(q) || c.lastMessage.toLowerCase().includes(q),
    );
  }, [allConversations, query]);

  const active = useMemo(
    () => allConversations.find((c) => c.id === activeId) ?? null,
    [allConversations, activeId],
  );

  const messages = useMemo(() => {
    if (!active) return [];
    return [...(active.messages ?? []), ...(pendingMessages[active.id] ?? [])];
  }, [active, pendingMessages]);

  const handleSend = (text: string) => {
    if (!active) return;
    sendMessage.mutate(
      { conversationId: active.id, text },
      {
        onSuccess: (result) => {
          setPendingMessages((prev) => ({
            ...prev,
            [active.id]: [
              ...(prev[active.id] ?? []),
              { ...result, text },
            ],
          }));
        },
      },
    );
  };

  const handleStart = (user: SystemUser) => {
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: Date.now(),
      participant: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        providerRole: user.providerRole,
        title: user.title,
        photoURL: user.photoURL,
        isOnline: user.isOnline,
      },
      lastMessage: "",
      lastMessageAt: now,
      unreadCount: 0,
      messages: [],
    };
    setCreated((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessagesSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t("conversations.header.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("conversations.header.subtitle")}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          {t("conversations.new.title")}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <ConversationList
          conversations={filtered}
          activeId={activeId}
          query={query}
          isLoading={isLoading}
          onQueryChange={setQuery}
          onSelect={setActiveId}
          onNewConversation={() => setModalOpen(true)}
        />

        <ChatThreadPanel
          conversation={active}
          messages={messages}
          isSending={sendMessage.isPending}
          onSend={handleSend}
        />
      </div>

      <StartConversationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStart={handleStart}
      />
    </div>
  );
};

export default ConversationsView;