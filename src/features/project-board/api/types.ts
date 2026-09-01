export type BoardPriority = "low" | "medium" | "high" | "urgent";

export interface TodoCard {
  id: string;
  title: string;
  description?: string;
  priority: BoardPriority;
  tags?: string[];
  assignee?: { id: string; name: string } | null;
  dueDate?: string | null;
}

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
  cards: TodoCard[];
}

export interface BoardData {
  columns: BoardColumn[];
}

export interface BoardMember {
  id: string;
  name: string;
}
