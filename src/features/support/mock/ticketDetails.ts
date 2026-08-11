import type { TicketDetails } from "../api/types";

export const mockTicketDetails: TicketDetails = {
  ticket_id: "TCK-9921",
  subject: "تأخير في عملية السحب البنكي للأرباح",
  department: "العمليات المالية",
  status: "in_progress",
  priority: "urgent",
  customer: {
    id: "INV-8821",
    name: "خالد الماجد",
    role: "Investor",
    email: "khaled@example.com",
    join_date: "2025-01-01",
    previous_tickets_count: 3,
  },
  messages: [
    {
      id: 1,
      sender_type: "customer",
      sender_name: "خالد الماجد",
      content:
        "السلام عليكم، قمت بطلب سحب أرباح بقيمة 5000$ منذ يومين ولم تصل لحسابي البنكي حتى الآن. أرجو الإفادة.",
      is_internal_note: false,
      created_at: "2026-08-11T10:30:00Z",
    },
    {
      id: 2,
      sender_type: "agent",
      sender_name: "أحمد علي",
      content:
        "تم فحص الحساب من النظام المالي. السحب معلق بسبب الحاجة لتحديث صورة الهوية الوطنية الناقصة.",
      is_internal_note: true,
      created_at: "2026-08-11T10:40:00Z",
    },
  ],
};
