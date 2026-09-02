import type { ProviderRole, Role } from "@/types";

export interface ChatParticipant {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
  providerRole?: ProviderRole;
  title: string;
  photoURL?: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: number;
  senderId: number;
  text: string;
  sentAt: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  participant: ChatParticipant;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface ConversationFilters {
  Search?: string;
}

export interface SendMessagePayload {
  conversationId: number;
  text: string;
}

export interface SendMessageResponse {
  id: string;
  conversationId: number;
  senderId: number;
  sentAt: string;
  read: boolean;
}

export interface SystemUser {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
  providerRole?: ProviderRole;
  title: string;
  photoURL?: string;
  isOnline: boolean;
}