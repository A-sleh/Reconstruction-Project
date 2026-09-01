import { CalendarClock, Pencil, Trash2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { TodoCard } from "../api/types";
import PriorityBadge from "./PriorityBadge";

interface Props {
  card: TodoCard;
  onDragStart: (id: string) => void;
  onEdit: (card: TodoCard) => void;
  onDelete: (id: string) => void;
}

const BoardCard = ({ card, onDragStart, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();
  const initials = card.assignee
    ? card.assignee.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
    : null;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(card.id)}
      className="group cursor-grab rounded-lg border border-gray-300 bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <PriorityBadge priority={card.priority} />
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(card)}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={t("projectBoard.card.title", "Edit")}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(card.id)}
            className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-destructive"
            aria-label={t("projectBoard.toast.delete", "Delete")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <h4 className="mt-2 text-sm font-semibold text-foreground">
        {card.title}
      </h4>
      {card.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {card.description}
        </p>
      )}

      {card.tags && card.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {initials ? (
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                "bg-primary",
              )}
            >
              {initials}
            </span>
          ) : (
            <User className="h-3.5 w-3.5" />
          )}
          <span className="truncate max-w-20">
            {card.assignee ? card.assignee.name : "—"}
          </span>
        </div>
        {card.dueDate && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{card.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardCard;
