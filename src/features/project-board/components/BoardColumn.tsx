import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { BoardColumn as BoardColumnType, TodoCard } from "../api/types";
import BoardCard from "./BoardCard";
import BoardCardModal from "./BoardCardModal";
import BoardColumnModal from "./BoardColumnModal";

interface Props {
  column: BoardColumnType;
  isDropTarget: boolean;
  onDragOver: (columnId: string) => void;
  onDrop: (columnId: string) => void;
  onDragStart: (cardId: string) => void;
  onAddCard: (card: TodoCard, columnId: string) => void;
  onEditCard: (card: TodoCard, columnId: string) => void;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onRenameColumn: (title: string, columnId: string) => void;
  members: { id: string; name: string }[];
}

const BoardColumn = ({
  column,
  isDropTarget,
  onDragOver,
  onDrop,
  onDragStart,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDeleteColumn,
  onRenameColumn,
  members,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(column.id);
      }}
      className={cn(
        "flex max-h-full w-72 shrink-0 flex-col rounded-xl border border-gray-300 bg-white",
        isDropTarget && "border-primary ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
          <h3 className="text-sm font-semibold text-foreground">
            {column.title}
          </h3>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {column.cards.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <BoardColumnModal
            mode="edit"
            column={{ id: column.id, title: column.title }}
            onSave={(title, colId) => onRenameColumn(title, colId ?? column.id)}
            openButton={
              <button
                type="button"
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t("projectBoard.editColumn")}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            }
          />
          <button
            type="button"
            onClick={() => onDeleteColumn(column.id)}
            className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-destructive"
            aria-label={t("projectBoard.deleteColumn")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
        style={{ maxHeight: "65vh" }}
      >
        {column.cards.map((card) => (
          <BoardCard
            key={card.id}
            card={card}
            onDragStart={onDragStart}
            onEdit={(c) => onEditCard(c, column.id)}
            onDelete={(id) => onDeleteCard(id, column.id)}
          />
        ))}

        {column.cards.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <p className="text-xs font-medium text-muted-foreground">
              {t("projectBoard.empty.title")}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">
              {t("projectBoard.empty.hint")}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-2">
        <BoardCardModal
          members={members}
          columnId={column.id}
          onSave={(card, colId) => onAddCard(card, colId ?? column.id)}
          openButton={
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
            >
              <Plus className="h-4 w-4" />
              {t("projectBoard.addCard")}
            </Button>
          }
          triggerLabel={t("projectBoard.addCard")}
        />
      </div>
    </div>
  );
};

export default BoardColumn;
