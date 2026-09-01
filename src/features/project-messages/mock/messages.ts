import type {
  ProjectChatParticipant,
  ProjectMessage,
} from "../api/types";

export const MOCK_CHAT_PARTICIPANTS: ProjectChatParticipant[] = [
  { id: "p1", name: "Lina Haddad", role: "Site Manager", avatarColor: "bg-primary", isOnline: true },
  { id: "p2", name: "Omar Kabbani", role: "Structural Engineer", avatarColor: "bg-amber-500", isOnline: true },
  { id: "p3", name: "Sara Mansour", role: "Procurement", avatarColor: "bg-emerald-500", isOnline: true },
  { id: "p4", name: "Youssef Nasser", role: "Workshop Supervisor", avatarColor: "bg-indigo-500", isOnline: false },
  { id: "p5", name: "Rania Fahmy", role: "Investor Representative", avatarColor: "bg-rose-500", isOnline: true },
];

export const MOCK_CHAT_MESSAGES: ProjectMessage[] = [
  {
    id: "msg-1",
    text: "Good morning everyone. Concrete delivery for Building B is scheduled for tomorrow 7 AM.",
    senderId: "p1",
    timestamp: "2026-09-01T08:15:00",
    type: "message",
  },
  {
    id: "msg-2",
    text: "Confirmed. I will make sure the site team is ready for the pour.",
    senderId: "p4",
    timestamp: "2026-09-01T08:22:00",
    type: "message",
  },
  {
    id: "msg-3",
    text: "Can someone send me the updated steel quantity list for the first floor?",
    senderId: "p3",
    timestamp: "2026-09-01T08:40:00",
    type: "message",
  },
  {
    id: "msg-4",
    text: "Attached in the board under the Materials tag. Let me know if quantities changed.",
    senderId: "p2",
    timestamp: "2026-09-01T08:48:00",
    type: "message",
  },
  {
    id: "msg-5",
    text: "Received. I'll follow up with the supplier today.",
    senderId: "p3",
    timestamp: "2026-09-01T09:05:00",
    type: "message",
  },
  {
    id: "msg-6",
    text: "Reminder: weekly safety inspection report is due Friday.",
    senderId: "p5",
    timestamp: "2026-09-01T09:30:00",
    type: "note",
  },
];