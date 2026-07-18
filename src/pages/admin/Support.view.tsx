import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, PanelLeftClose, PanelLeft, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListUsersMessages from "@/features/support/components/ListUsersMessages";
import ChatHeader from "@/features/support/components/ChatHeader";
import ChatMessages from "@/features/support/components/ChatMessages";
import ChatAction from "@/features/support/components/ChatAction";
import { cn } from "@/lib/utils";

interface UserMessage {
  id: string;
  avatar: string;
  name: string;
  phone: string;
  lastMessage: string;
  messageDate: string;
  isActive?: boolean;
  unreadCount?: number;
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: string;
  senderName?: string;
}

const newUserMessages: UserMessage[] = [
  {
    id: "1",
    avatar: "https://i.pravatar.cc/150?img=1",
    name: "Ahmed Hassan",
    phone: "+20 123 456 7890",
    lastMessage: "Great, thank you for the quick response!",
    messageDate: "10:34 AM",
    isActive: true,
    unreadCount: 2,
  },
  {
    id: "2",
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "Sara Mohamed",
    phone: "+20 112 345 6789",
    lastMessage: "Can you send me the invoice for the last order?",
    messageDate: "Yesterday",
    isActive: false,
  },
  {
    id: "3",
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Omar Ali",
    phone: "+20 109 876 5432",
    lastMessage: "The order has been delivered successfully",
    messageDate: "Yesterday",
    isActive: true,
    unreadCount: 5,
  },
];

const repliedUserMessages: UserMessage[] = [
  {
    id: "4",
    avatar: "https://i.pravatar.cc/150?img=4",
    name: "Fatima Khalid",
    phone: "+20 155 555 1234",
    lastMessage: "I need help with my return request",
    messageDate: "Mon",
    isActive: false,
  },
  {
    id: "5",
    avatar: "https://i.pravatar.cc/150?img=5",
    name: "Youssef Nabil",
    phone: "+20 128 888 9999",
    lastMessage: "When will my order arrive?",
    messageDate: "Sun",
    isActive: false,
  },
  {
    id: "6",
    avatar: "https://i.pravatar.cc/150?img=6",
    name: "Mona Saeed",
    phone: "+20 111 222 3333",
    lastMessage: "Perfect, thanks!",
    messageDate: "Jul 10",
    isActive: true,
  },
];

const mockConversations: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hello, I need help with my order",
      sender: "other",
      timestamp: "10:30 AM",
      senderName: "Ahmed",
    },
    {
      id: "2",
      text: "Sure! Can you provide your order number?",
      sender: "me",
      timestamp: "10:31 AM",
    },
    {
      id: "3",
      text: "It's #ORD-2024-1234",
      sender: "other",
      timestamp: "10:32 AM",
      senderName: "Ahmed",
    },
    {
      id: "4",
      text: "I found your order. It's currently being processed and will ship within 24 hours.",
      sender: "me",
      timestamp: "10:33 AM",
    },
    {
      id: "5",
      text: "Great, thank you for the quick response!",
      sender: "other",
      timestamp: "10:34 AM",
      senderName: "Ahmed",
    },
  ],
  "2": [
    {
      id: "1",
      text: "Hi, I'd like to request an invoice for my last purchase",
      sender: "other",
      timestamp: "2:15 PM",
      senderName: "Sara",
    },
    {
      id: "2",
      text: "Of course! Could you share your order ID?",
      sender: "me",
      timestamp: "2:16 PM",
    },
    {
      id: "3",
      text: "Can you send me the invoice for the last order?",
      sender: "other",
      timestamp: "2:20 PM",
      senderName: "Sara",
    },
  ],
  "3": [
    {
      id: "1",
      text: "Where is my order? It's been 5 days",
      sender: "other",
      timestamp: "9:00 AM",
      senderName: "Omar",
    },
    {
      id: "2",
      text: "Let me check the status for you",
      sender: "me",
      timestamp: "9:02 AM",
    },
    {
      id: "3",
      text: "The order has been delivered successfully",
      sender: "other",
      timestamp: "11:30 AM",
      senderName: "Omar",
    },
  ],
  "4": [
    {
      id: "1",
      text: "I received the wrong item in my order",
      sender: "other",
      timestamp: "3:00 PM",
      senderName: "Fatima",
    },
    {
      id: "2",
      text: "I'm sorry to hear that. Can you send a photo of what you received?",
      sender: "me",
      timestamp: "3:05 PM",
    },
    {
      id: "3",
      text: "I need help with my return request",
      sender: "other",
      timestamp: "3:10 PM",
      senderName: "Fatima",
    },
  ],
  "5": [
    {
      id: "1",
      text: "Hi, I placed an order 3 days ago",
      sender: "other",
      timestamp: "11:00 AM",
      senderName: "Youssef",
    },
    {
      id: "2",
      text: "When will my order arrive?",
      sender: "other",
      timestamp: "11:01 AM",
      senderName: "Youssef",
    },
  ],
  "6": [
    {
      id: "1",
      text: "Thank you for resolving my issue!",
      sender: "other",
      timestamp: "4:00 PM",
      senderName: "Mona",
    },
    {
      id: "2",
      text: "You're welcome! Let us know if you need anything else.",
      sender: "me",
      timestamp: "4:02 PM",
    },
    {
      id: "3",
      text: "Perfect, thanks!",
      sender: "other",
      timestamp: "4:03 PM",
      senderName: "Mona",
    },
  ],
};

const Support = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserMessage | null>(null);
  const [conversations, setConversations] =
    useState<Record<string, Message[]>>(mockConversations);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredNewUsers = useMemo(
    () =>
      newUserMessages.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone.includes(searchQuery),
      ),
    [searchQuery],
  );

  const filteredRepliedUsers = useMemo(
    () =>
      repliedUserMessages.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone.includes(searchQuery),
      ),
    [searchQuery],
  );

  const currentMessages = selectedUser
    ? conversations[selectedUser.id] || []
    : [];

  const handleSend = (text: string) => {
    if (!selectedUser) return;
    const newMsg: Message = {
      id: String(Date.now()),
      text,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setConversations((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg],
    }));
  };

  const handleSelectUser = (user: UserMessage) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-full gap-3 bg-background">
      <div
        className={cn(
          `flex flex-col max-w-sm  bg-card duration-300 ease-in-out overflow-hidden transition-all rounded-lg`,
          isSidebarOpen ? "w-full" : "w-0",
        )}
      >
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                "support.listUsers.searchPlaceholder",
                "Search conversations...",
              )}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="new" className="flex flex-col flex-1 min-h-0">
          <TabsList className="mx-3 mt-2">
            <TabsTrigger value="new" className="flex-1">
              {t("support.tabs.new", "New")}
              {filteredNewUsers.some((u) => u.unreadCount) && (
                <span className="ml-1.5 size-1.5 rounded-full bg-success" />
              )}
            </TabsTrigger>
            <TabsTrigger value="replied" className="flex-1">
              {t("support.tabs.replied", "Replied")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="flex-1 mt-0 overflow-hidden">
            <ListUsersMessages
              users={filteredNewUsers}
              onSelectUser={handleSelectUser}
            />
          </TabsContent>

          <TabsContent value="replied" className="flex-1 mt-0 overflow-hidden">
            <ListUsersMessages
              users={filteredRepliedUsers}
              onSelectUser={handleSelectUser}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col flex-1 min-w-0 min-h-150 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
          <Button
            variant="ghost"
            className="hover:bg-gray-300/30 transition-all cursor-pointer"
            size="icon"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            data-icon="inline-start"
          >
            {isSidebarOpen ? <PanelLeftClose /> : <PanelLeft />}
          </Button>

          {selectedUser && (
            <div className="flex-1 min-w-0">
              <ChatHeader
                user={{
                  avatar: selectedUser.avatar,
                  name: selectedUser.name,
                  isActive: selectedUser.isActive ?? false,
                  phone: selectedUser.phone,
                }}
              />
            </div>
          )}
        </div>

        {selectedUser ? (
          <>
            <ChatMessages messages={currentMessages} />
            <ChatAction onSend={handleSend} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-full bg-muted">
              <MessageSquare className="size-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {t("support.emptyState.title", "No conversation selected")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  "support.emptyState.description",
                  "Choose a conversation from the list to start messaging",
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
