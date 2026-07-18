import { MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatUser {
  avatar: string;
  name: string;
  isActive: boolean;
  phone: string;
}

interface ChatHeaderProps {
  user: ChatUser;
}

const ChatHeader = ({ user }: ChatHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <img
        src={user.avatar}
        alt={user.name}
        className="size-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {user.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-2 rounded-full",
              user.isActive ? "bg-success" : "bg-muted-foreground/50"
            )}
          />
          <span className="text-xs text-muted-foreground">
            {user.isActive
              ? t("support.chatHeader.active", "Active")
              : user.phone}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" data-icon="inline-start">
          <MoreVertical />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
