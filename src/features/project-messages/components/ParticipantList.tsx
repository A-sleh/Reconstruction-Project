import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { ProjectChatParticipant } from "../api/types";

interface Props {
  participants: ProjectChatParticipant[];
  currentUserId: string;
}

const ParticipantList = ({ participants, currentUserId }: Props) => {
  const { t } = useTranslation();
  const onlineCount = participants.filter((p) => p.isOnline).length;

  return (
    <div className="flex flex-col rounded-xl border border-gray-300 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          {t("projectMessages.members")}
        </h3>
        <span className="text-xs text-muted-foreground">
          {onlineCount}{" "}
          {t("projectMessages.online")}
        </span>
      </div>

      <ul className="divide-y divide-gray-100">
        {participants.map((participant) => {
          const initials = participant.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("");
          const isCurrent = participant.id === currentUserId;

          return (
            <li key={participant.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                  participant.avatarColor,
                )}
              >
                {initials}
                <span
                  className={cn(
                    "absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                    participant.isOnline ? "bg-emerald-500" : "bg-gray-300",
                  )}
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {participant.name}
                  {isCurrent && (
                    <span className="ms-1 text-[11px] font-normal text-primary">
                      ({t("projectMessages.you")})
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {participant.role}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ParticipantList;