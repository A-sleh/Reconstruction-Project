import { useTranslation } from "react-i18next";
import { Search, PenSquare, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Conversation } from "../api/types";
import ConversationItem from "./ConversationItem";

interface Props {
  conversations: Conversation[];
  activeId: number | null;
  query: string;
  isLoading: boolean;
  onQueryChange: (q: string) => void;
  onSelect: (id: number) => void;
  onNewConversation: () => void;
}

const ConversationList = ({
  conversations,
  activeId,
  query,
  isLoading,
  onQueryChange,
  onSelect,
  onNewConversation,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-card">
      <div className="space-y-3 border-b border-gray-200 p-3">
        <Button
          variant="default"
          className="w-full gap-1.5"
          onClick={onNewConversation}
        >
          <PenSquare className="h-4 w-4" />
          {t("conversations.list.newConversation")}
        </Button>

        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t("conversations.list.searchPlaceholder")}
            className="ps-9"
          />
        </div>
      </div>

      <div className="max-h-[calc(100vh-16rem)] flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <MessageSquare className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-muted-foreground">
              {t("conversations.list.empty")}
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeId}
              onClick={() => onSelect(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;