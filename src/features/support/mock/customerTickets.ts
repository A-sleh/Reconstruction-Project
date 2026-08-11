import type { CustomerTicket, CustomerTicketsResponse } from "../api/types";

export const mockCustomerTickets: CustomerTicket[] = [
  {
    ticket_id: "TCK-8112",
    subject: "طلب كشف حساب سليم",
    status: "resolved",
    resolved_at: "2026-05-10",
  },
  {
    ticket_id: "TCK-7901",
    subject: "تحديث بيانات المستثمر",
    status: "resolved",
    resolved_at: "2026-03-22",
  },
  {
    ticket_id: "TCK-7718",
    subject: "استفسار عن عمولة السحب",
    status: "closed",
    resolved_at: "2026-01-05",
  },
];

export const mockCustomerTicketsResponse: CustomerTicketsResponse = {
  data: mockCustomerTickets,
};
