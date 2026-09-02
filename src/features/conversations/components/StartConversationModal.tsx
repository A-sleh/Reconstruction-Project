import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { SystemUser } from "../api/types";
import { MOCK_SYSTEM_USERS } from "../mock/systemUsers";
import { ROLE_LABEL_KEYS } from "../constants";
import ChatAvatar from "./ChatAvatar";

interface Props {
  open: boolean;
  onClose: () => void;
  onStart: (user: SystemUser) => void;
}

const StartConversationModal = ({ open, onClose, onStart }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const users = useMemo(() => {
    if (!open) return [];
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_SYSTEM_USERS;
    return MOCK_SYSTEM_USERS.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.title.toLowerCase().includes(q),
    );
  }, [open, query]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("conversations.new.title")}</DialogTitle>
          <DialogDescription>
            {t("conversations.new.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("conversations.new.searchPlaceholder")}
            className="ps-9"
            autoFocus
          />
        </div>

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <Users className="h-10 w-10 text-gray-300" />
              <p className="text-sm text-muted-foreground">
                {t("conversations.new.noUsers")}
              </p>
            </div>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  onStart(user);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-lg p-2.5 text-start transition-colors hover:bg-muted/50"
              >
                <ChatAvatar
                  participant={user}
                  isOnline={user.isOnline}
                  showStatus
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {t(ROLE_LABEL_KEYS[user.role])}
                    {user.title && (
                      <span className="ms-1 text-muted-foreground/50">
                        · {user.title}
                      </span>
                    )}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartConversationModal;