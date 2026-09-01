export type MessageType = "message" | "note";

export interface ProjectChatParticipant {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  isOnline: boolean;
}

export interface ProjectMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  type: MessageType;
}