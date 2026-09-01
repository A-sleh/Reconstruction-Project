import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
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

interface ListUsersMessagesProps {
  users: UserMessage[];
  onSelectUser?: (user: UserMessage) => void;
}

const mockUsers: UserMessage[] = [
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

const ListUsersMessages = ({
  users = mockUsers,
  onSelectUser,
}: Partial<ListUsersMessagesProps>) => {
  const { t } = useTranslation();

  if (users.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-full">
        <p className="text-sm text-muted-foreground">
          {t("support.listUsers.noUsers")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-full">
      <div className="flex flex-col">
        {users.map((user) => (
          <Card
            key={user.id}
            className={cn(
              "rounded-none border-0 border-b border-gray-300 cursor-pointer transition-colors hover:bg-muted/50"
            )}
            onClick={() => onSelectUser?.(user)}
          >
            <CardContent className="flex items-center gap-3 p-3">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-10 rounded-full object-cover"
                />
                {user.isActive && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success ring-2 ring-card" />
                )}
              </div>

              <div className="flex-1 min-w-0 shrink">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.phone}
                </p>
              </div>

              <div className="hidden md:block flex-1 min-w-0 shrink">
                <p className="text-sm text-muted-foreground truncate">
                  {user.lastMessage}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {user.messageDate}
                </p>
                {user.unreadCount && user.unreadCount > 0 && (
                  <Badge className="size-5 justify-center rounded-full p-0 text-[10px]">
                    {user.unreadCount}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListUsersMessages;
