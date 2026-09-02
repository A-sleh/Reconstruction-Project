import { cn } from "@/lib/utils";
import { getDominImageURL } from "@/lib/helpers";
import type { ChatParticipant } from "../api/types";
import { PARTICIPANT_COLORS } from "../constants";

interface Props {
  participant: Pick<
    ChatParticipant,
    "firstName" | "lastName" | "role" | "photoURL"
  >;
  isOnline?: boolean;
  showStatus?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
};

const DOT_SIZES = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

const ChatAvatar = ({
  participant,
  isOnline = false,
  showStatus = false,
  size = "md",
}: Props) => {
  const initials = `${participant.firstName.charAt(0)}${participant.lastName.charAt(0)}`.toUpperCase();

  return (
    <span className="relative inline-flex shrink-0">
      {participant.photoURL ? (
        <img
          src={getDominImageURL(participant.photoURL)}
          alt={`${participant.firstName} ${participant.lastName}`}
          loading="lazy"
          className={cn(
            "rounded-full object-cover ring-2 ring-primary/10",
            SIZES[size],
          )}
        />
      ) : (
        <span
          className={cn(
            "flex items-center justify-center rounded-full font-bold text-white ring-2 ring-primary/10",
            PARTICIPANT_COLORS[participant.role],
            SIZES[size],
          )}
        >
          {initials}
        </span>
      )}
      {showStatus && (
        <span
          className={cn(
            "absolute -bottom-0.5 -end-0.5 rounded-full border-2 border-white",
            DOT_SIZES[size],
            isOnline ? "bg-emerald-500" : "bg-gray-300",
          )}
        />
      )}
    </span>
  );
};

export default ChatAvatar;