export interface PendingRequest {
  id: number;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  categoryName: string;
  description: string;
  type: "resource" | "service";
  createdAt: string;
}

export const MOCK_PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 1,
    ownerFirstName: "عبدالفتاح",
    ownerLastName: "عصلة",
    ownerEmail: "abdelfattah@example.com",
    categoryName: "حديد تسليح",
    description: "طلب إضافة فئة حديد تسليح نوع جديد للمخزون",
    type: "resource",
    createdAt: "2026-07-15",
  },
  {
    id: 2,
    ownerFirstName: "محمد",
    ownerLastName: "أحمد",
    ownerEmail: "mohammed@example.com",
    categoryName: "أعمال كهربائية",
    description: "طلب إضافة فئة أعمال كهربائية ت شاملة",
    type: "service",
    createdAt: "2026-07-16",
  },
  {
    id: 3,
    ownerFirstName: "سارة",
    ownerLastName: "خالد",
    ownerEmail: "sara@example.com",
    categoryName: "أسمنت بورتلاندي",
    description: "إضافة صنف أسمنت بورتلاندي نوع ا",
    type: "resource",
    createdAt: "2026-07-16",
  },
  {
    id: 4,
    ownerFirstName: "أحمد",
    ownerLastName: "محمد",
    ownerEmail: "ahmed@example.com",
    categoryName: "أعمال سباكة",
    description: "خدمة سباكة متكاملة للمواقع",
    type: "service",
    createdAt: "2026-07-17",
  },
  {
    id: 5,
    ownerFirstName: "ليلى",
    ownerLastName: "عمر",
    ownerEmail: "layla@example.com",
    categoryName: "أخشاب بنيان",
    description: "إضافة فئة الأخشاب للمخزون",
    type: "resource",
    createdAt: "2026-07-17",
  },
  {
    id: 6,
    ownerFirstName: "خالد",
    ownerLastName: "سليمان",
    ownerEmail: "khaled@example.com",
    categoryName: "أعمال لحام",
    description: "خدمة لحام متخصصة للمباني",
    type: "service",
    createdAt: "2026-07-18",
  },
];

export const MOCK_CATEGORIES = [
  "حديد تسليح",
  "أسمنت بورتلاندي",
  "أخشاب بنيان",
  "أعمال كهربائية",
  "أعمال سباكة",
  "أعمال لحام",
  "مواد عازلة",
  "بلاط وسيراميك",
];
