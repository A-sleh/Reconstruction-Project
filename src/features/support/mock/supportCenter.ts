import type {
  KbCategory,
  KbFaq,
  KbSearchResult,
  SupportTicket,
  TicketThread,
} from "../api/types";

// ============================================================================
// Knowledge Base
// ============================================================================
export const mockKbCategories: KbCategory[] = [
  {
    id: "kb-account",
    title: "Account & Billing",
    description: "Login issues, verification, invoices and payments.",
    articles_count: 24,
    icon: "account",
  },
  {
    id: "kb-projects",
    title: "Projects & Construction",
    description: "Creating projects, assigning workshops and tracking progress.",
    articles_count: 31,
    icon: "project",
  },
  {
    id: "kb-orders",
    title: "Orders & Requests",
    description: "Placing orders, managing resources and delivery timelines.",
    articles_count: 18,
    icon: "order",
  },
  {
    id: "kb-work-sites",
    title: "Work Sites",
    description: "Managing work sites, equipment and site status.",
    articles_count: 15,
    icon: "site",
  },
  {
    id: "kb-marketplace",
    title: "Marketplace",
    description: "Listing and investing in lands and buildings.",
    articles_count: 12,
    icon: "market",
  },
  {
    id: "kb-notifications",
    title: "Notifications & Alerts",
    description: "Understanding notifications, alerts and live updates.",
    articles_count: 8,
    icon: "notify",
  },
];

export const mockKbSearchResults: KbSearchResult[] = [
  {
    article_id: 1001,
    title: "How do I create a new project?",
    category: "Projects & Construction",
    snippet:
      "Navigate to the Projects section, click 'New Project', fill in the required fields and assign a supervisor.",
  },
  {
    article_id: 1002,
    title: "How can I add a workshop to a project?",
    category: "Projects & Construction",
    snippet:
      "Open the project details, go to Workshops and use the 'Add Workshop' button to attach contractors.",
  },
  {
    article_id: 1003,
    title: "What is the reconstruction work order process?",
    category: "Orders & Requests",
    snippet:
      "Orders move from Requested to Approved, In Progress, then Completed. Track live status on the order card.",
  },
  {
    article_id: 1004,
    title: "How do I invite an engineer to my work site?",
    category: "Work Sites",
    snippet:
      "From the work site panel, select 'Members' and send an invite by email to the engineer.",
  },
];

export const mockKbPopularFaqs: KbFaq[] = [
  {
    id: 1,
    question: "How do I change my password?",
    answer:
      "Go to your profile, select Security, enter your current password and set a new one. You'll receive a confirmation email.",
  },
  {
    id: 2,
    question: "Why is my order still pending?",
    answer:
      "Orders stay pending until the assigned provider confirms availability. You can message them directly from the order page.",
  },
  {
    id: 3,
    question: "How is my request prioritised?",
    answer:
      "Priority is set when creating a request (Low, Medium, High, Urgent). Urgent requests are escalated to our support team automatically.",
  },
  {
    id: 4,
    question: "Can I cancel a submitted request?",
    answer:
      "Yes. Open the request and select 'Cancel'. Cancellation is only allowed before the provider starts working on it.",
  },
  {
    id: 5,
    question: "How do I contact a support agent?",
    answer:
      "Open the Support Center, click 'Create Ticket', choose a category and describe your issue. Our team replies within a ticket thread.",
  },
];

// ============================================================================
// User-facing ticket list + threads
// ============================================================================
export const mockMyTickets: SupportTicket[] = [
  {
    id: "TCK-8421",
    subject: "Unable to verify my property documents",
    category: "Marketplace",
    priority: "high",
    status: "in_progress",
    createdAt: "2026-08-27",
    updatedAt: "2026-08-30",
    lastMessage: "Our team is reviewing your documents.",
    unread: true,
  },
  {
    id: "TCK-8307",
    subject: "Question about the latest invoice",
    category: "Account & Billing",
    priority: "medium",
    status: "pending_customer",
    createdAt: "2026-08-19",
    updatedAt: "2026-08-21",
    lastMessage: "Could you confirm the payment method you used?",
    unread: false,
  },
  {
    id: "TCK-8155",
    subject: "Request for additional equipment on site",
    category: "Work Sites",
    priority: "low",
    status: "resolved",
    createdAt: "2026-07-30",
    updatedAt: "2026-08-02",
    lastMessage: "Your request has been fulfilled. Thank you!",
    unread: false,
  },
  {
    id: "TCK-7982",
    subject: "Order delivery delayed",
    category: "Orders & Requests",
    priority: "urgent",
    status: "open",
    createdAt: "2026-07-12",
    updatedAt: "2026-07-12",
    lastMessage: "We are looking into the delivery delay right away.",
    unread: true,
  },
];

export const mockTicketThreads: Record<string, TicketThread> = {
  "TCK-8421": {
    ticket_id: "TCK-8421",
    subject: "Unable to verify my property documents",
    department: "Marketplace",
    priority: "high",
    status: "in_progress",
    can_rate: false,
    messages: [
      {
        id: 1,
        sender_type: "customer",
        sender_name: "You",
        avatar_initial: "Y",
        content:
          "Hello, I uploaded my property papers but verification is still pending.",
        created_at: "2026-08-27",
      },
      {
        id: 2,
        sender_type: "agent",
        sender_name: "Support Agent",
        avatar_initial: "S",
        content:
          "Hi there! Thank you for reaching out. Could you confirm the document type you uploaded?",
        created_at: "2026-08-28",
      },
      {
        id: 3,
        sender_type: "customer",
        sender_name: "You",
        avatar_initial: "Y",
        content: "It is the ownership deed certificate.",
        created_at: "2026-08-28",
      },
      {
        id: 4,
        sender_type: "agent",
        sender_name: "Support Agent",
        avatar_initial: "S",
        content:
          "Got it. Our team is reviewing your documents now. We'll update you shortly.",
        created_at: "2026-08-30",
      },
    ],
  },
  "TCK-8307": {
    ticket_id: "TCK-8307",
    subject: "Question about the latest invoice",
    department: "Account & Billing",
    priority: "medium",
    status: "pending_customer",
    can_rate: false,
    messages: [
      {
        id: 1,
        sender_type: "customer",
        sender_name: "You",
        avatar_initial: "Y",
        content: "Hello, I have a question about invoice #8449.",
        created_at: "2026-08-19",
      },
      {
        id: 2,
        sender_type: "agent",
        sender_name: "Support Agent",
        avatar_initial: "S",
        content:
          "Could you confirm the payment method you used for this invoice?",
        created_at: "2026-08-21",
      },
    ],
  },
  "TCK-8155": {
    ticket_id: "TCK-8155",
    subject: "Request for additional equipment on site",
    department: "Work Sites",
    priority: "low",
    status: "resolved",
    can_rate: true,
    messages: [
      {
        id: 1,
        sender_type: "customer",
        sender_name: "You",
        avatar_initial: "Y",
        content: "I need an additional crane for workshop 2.",
        created_at: "2026-07-30",
      },
      {
        id: 2,
        sender_type: "agent",
        sender_name: "Support Agent",
        avatar_initial: "S",
        content: "Noted. We'll coordinate the equipment with the site manager.",
        created_at: "2026-08-01",
      },
      {
        id: 3,
        sender_type: "agent",
        sender_name: "Support Agent",
        avatar_initial: "S",
        content: "Your request has been fulfilled. Thank you!",
        created_at: "2026-08-02",
      },
    ],
  },
  "TCK-7982": {
    ticket_id: "TCK-7982",
    subject: "Order delivery delayed",
    department: "Orders & Requests",
    priority: "urgent",
    status: "open",
    can_rate: false,
    messages: [
      {
        id: 1,
        sender_type: "customer",
        sender_name: "You",
        avatar_initial: "Y",
        content: "My order is delayed by three days. Can you help?",
        created_at: "2026-07-12",
      },
      {
        id: 2,
        sender_type: "agent",
        sender_name: "Support Agent",
        avatar_initial: "S",
        content: "We are looking into the delivery delay right away.",
        created_at: "2026-07-12",
      },
    ],
  },
};
