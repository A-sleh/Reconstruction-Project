import type { AgentTicket, AgentTicketsResponse } from "../api/types";

export const mockAgentTickets: AgentTicket[] = [
  {
    ticket_id: "TCK-9921",
    customer_name: "خالد الماجد",
    customer_role: "Investor",
    subject: "تأخير في عملية السحب البنكي للأرباح",
    priority: "urgent",
    status: "in_progress",
    sla_due_in_minutes: 25,
  },
  {
    ticket_id: "TCK-8810",
    customer_name: "شركة الموردين المتحدة",
    customer_role: "Provider",
    subject: "استفسار حول فاتورة التوريد الشهرية",
    priority: "low",
    status: "pending_customer",
    sla_due_in_minutes: 240,
  },
  {
    ticket_id: "TCK-8766",
    customer_name: "سارة الحمصي",
    customer_role: "Engineer",
    subject: "طلب إضافة موقع عمل جديد إلى مشروع إعادة الإعمار",
    priority: "high",
    status: "open",
    sla_due_in_minutes: 75,
  },
  {
    ticket_id: "TCK-8540",
    customer_name: "مؤسسة البناء السورية",
    customer_role: "Provider",
    subject: "التحقق من فاتورة طلب مواد حديد التسليح",
    priority: "medium",
    status: "resolved",
    sla_due_in_minutes: -30,
  },
];

export const mockAgentTicketsResponse: AgentTicketsResponse = {
  data: mockAgentTickets,
  total: mockAgentTickets.length,
  page: 1,
};
