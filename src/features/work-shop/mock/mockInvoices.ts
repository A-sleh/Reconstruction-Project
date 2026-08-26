import type { InvoicePayload, WorkShopInovcesHistory } from "../api/types";

export const MOCK_WORK_SHOP_INVOICES: WorkShopInovcesHistory[] = [
  {
    toWorkShop: "Al-Razi Tower Structural Works",
    date: new Date("2026-06-02"),
    amount: 8500000,
    modifyedBy: "Lina Haddad",
  },
  {
    toWorkShop: "Al-Mazzeh District Reconstruction",
    date: new Date("2026-05-28"),
    amount: 12000000,
    modifyedBy: "Omar Kabbani",
  },
  {
    toWorkShop: "Water Network Rehabilitation - Barzeh",
    date: new Date("2026-05-19"),
    amount: 6500000,
    modifyedBy: "Lina Haddad",
  },
  {
    toWorkShop: "Old City Souq Restoration",
    date: new Date("2026-05-11"),
    amount: 4300000,
    modifyedBy: "Sara Mansour",
  },
  {
    toWorkShop: "School Rebuild Program - Douma Phase 2",
    date: new Date("2026-04-30"),
    amount: 9750000,
    modifyedBy: "Omar Kabbani",
  },
  {
    toWorkShop: "Highway 7 Bridge Repair Crew",
    date: new Date("2026-04-21"),
    amount: 5200000,
    modifyedBy: "Sara Mansour",
  },
];

export const MOCK_INVOICES_BY_WORK_SHOP: Record<number, InvoicePayload[]> = {
  1: [
    {
      id: 101,
      data: new Date("2026-03-10"),
      description: "Advance payment for rebar supply",
      payedAmount: 12000000,
      attachments: [501],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
    {
      id: 102,
      data: new Date("2026-06-02"),
      description: "Second payment - concrete pouring crew",
      payedAmount: 8500000,
      attachments: [502, 503],
    },
  ],
  2: [
    {
      id: 103,
      data: new Date("2026-05-28"),
      description: "Masonry phase completion payment",
      payedAmount: 12000000,
      attachments: [504],
    },
  ],
  5: [
    {
      id: 104,
      data: new Date("2026-05-19"),
      description: "Night-shift excavation crews settlement",
      payedAmount: 6500000,
      attachments: [],
    },
  ],
};
