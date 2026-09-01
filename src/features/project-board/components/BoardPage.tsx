import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid, Plus } from "lucide-react";
import type { BoardColumn as BoardColumnType, TodoCard } from "../api/types";
import { MOCK_BOARD, MOCK_BOARD_MEMBERS } from "../mock/board";
import BoardColumn from "./BoardColumn";
import BoardCardModal from "./BoardCardModal";
import BoardColumnModal from "./BoardColumnModal";
import { successToast } from "@/components/common/Toast";
import i18n from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const COLUMN_COLORS = [
  "bg-primary",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-slate-400",
  "bg-indigo-500",
];

const BoardPage = () => {
  const { t, i18n: i18nHook } = useTranslation();
  const isRtl = i18nHook.language === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const [columns, setColumns] = useState<BoardColumnType[]>(MOCK_BOARD.columns);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const totalCards = useMemo(
    () => columns.reduce((acc, col) => acc + col.cards.length, 0),
    [columns],
  );

  const handleAddCard = (card: TodoCard, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, card] } : col,
      ),
    );
  };

  const handleEditCard = (card: TodoCard, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((c) => (c.id === card.id ? card : c)),
            }
          : col,
      ),
    );
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col,
      ),
    );
    successToast(i18n.t("projectBoard.toast.delete", "Card deleted"));
  };

  const handleDrop = (columnId: string) => {
    setDropTarget(null);
    if (!dragId) return;

    setColumns((prev) => {
      const source = prev.find((col) =>
        col.cards.some((c) => c.id === dragId),
      );
      if (!source) return prev;

      const card = source.cards.find((c) => c.id === dragId)!;
      const target = prev.find((col) => col.id === columnId);
      if (!target || target.id === source.id) return prev;

      return prev.map((col) => {
        if (col.id === source.id)
          return { ...col, cards: col.cards.filter((c) => c.id !== dragId) };
        if (col.id === columnId)
          return { ...col, cards: [...col.cards, card] };
        return col;
      });
    });

    setDragId(null);
    successToast(i18n.t("projectBoard.toast.moved", "Card moved"));
  };

  const handleSaveColumn = (title: string, columnId?: string) => {
    if (columnId) {
      setColumns((prev) =>
        prev.map((col) => (col.id === columnId ? { ...col, title } : col)),
      );
    } else {
      const newColumn: BoardColumnType = {
        id: `column-${crypto.randomUUID()}`,
        title,
        color: COLUMN_COLORS[columns.length % COLUMN_COLORS.length],
        cards: [],
      };
      setColumns((prev) => [...prev, newColumn]);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
    successToast(i18n.t("projectBoard.toast.columnDeleted", "Column deleted"));
  };

  return (
    <div className="space-y-5" dir={dir}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t("projectBoard.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("projectBoard.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 shadow-sm">
            <span className="text-xs font-semibold text-foreground">
              {totalCards}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("projectBoard.card.title", "Tasks")}
            </span>
          </div>
          <BoardColumnModal onSave={handleSaveColumn} mode="create" />
          <BoardCardModal
            members={MOCK_BOARD_MEMBERS}
            onSave={(card) => {
              if (columns[0]) handleAddCard(card, columns[0].id);
            }}
            openButton={
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4" />
                {t("projectBoard.addCard")}
              </Button>
            }
            triggerLabel={t("projectBoard.addCard")}
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            isDropTarget={dropTarget === column.id}
            onDragOver={setDropTarget}
            onDrop={handleDrop}
            onDragStart={setDragId}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onDeleteColumn={handleDeleteColumn}
            onRenameColumn={(title, colId) => handleSaveColumn(title, colId)}
            members={MOCK_BOARD_MEMBERS}
          />
        ))}

        <div className="w-72 shrink-0">
          <BoardColumnModal onSave={handleSaveColumn} mode="create" />
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
