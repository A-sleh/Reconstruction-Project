import type { Conversation, SendMessagePayload } from "./types";
import type { SendMessageResponse } from "./types";
import { MOCK_CONVERSATIONS } from "../mock/conversations";
import { CURRENT_USER_ID } from "../constants";

const BASE_ROUTE = "conversations";

export const ConversationsController = {
  GetAll: `${BASE_ROUTE}/get-all`,
  GetById: `${BASE_ROUTE}/get-by-id`,
  SendMessage: `${BASE_ROUTE}/send-message`,
} as const;

export const QUERY_KEYS = {
  conversations: {
    all: ["conversations"] as const,
    lists: () => [...QUERY_KEYS.conversations.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...QUERY_KEYS.conversations.lists(), filters] as const,
    detail: (id: number) =>
      [...QUERY_KEYS.conversations.all, "detail", id] as const,
    messages: (id: number) =>
      [...QUERY_KEYS.conversations.all, "messages", id] as const,
  },
};

export const MUTATION_KEYS = {
  conversations: {
    sendMessage: () => ["conversations", "send-message"] as const,
  },
};

// Mock-backed (swap real fetch for ApiInstance when backend is ready)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getConversations(): Promise<Conversation[]> {
  await delay(300);
  return MOCK_CONVERSATIONS;
}

export async function getConversationById(id: number): Promise<Conversation | undefined> {
  await delay(200);
  return MOCK_CONVERSATIONS.find((c) => c.id === id);
}

export async function sendMessage(
  payload: SendMessagePayload,
): Promise<SendMessageResponse> {
  await delay(600);
  return {
    id: `cm-${crypto.randomUUID()}`,
    conversationId: payload.conversationId,
    senderId: CURRENT_USER_ID,
    sentAt: new Date().toISOString(),
    read: false,
  };
}