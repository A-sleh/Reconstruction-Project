export interface SystemCategory {
  id: number;
  name: string;
  description: string;
  type: "resource" | "service";
  usageCount: number;
  tags: string[];
  createdAt: string;
}

export const MOCK_SYSTEM_CATEGORIES: SystemCategory[] = [
  {
    id: 1,
    name: "حديد تسليح",
    description: " جميع أنواع حديد التسليح المستخدم في البناء",
    type: "resource",
    usageCount: 24,
    tags: ["حديد", "تسليح", "بناء", "هياكل"],
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    name: "أسمنت بورتلاندي",
    description: "أسمنت بورتلاندي بأنواعه المختلفة",
    type: "resource",
    usageCount: 18,
    tags: ["أسمنت", "بورتلاندي", "خرسانة"],
    createdAt: "2026-01-15",
  },
  {
    id: 3,
    name: "أعمال كهربائية",
    description: "جميع أعمال التأسيس والتمديدات الكهربائية",
    type: "service",
    usageCount: 12,
    tags: ["كهرباء", "تأسيس", "تمديدات"],
    createdAt: "2026-02-01",
  },
  {
    id: 4,
    name: "أخشاب بنيان",
    description: "أخشاب البناء والأخشاب المصنعة",
    type: "resource",
    usageCount: 9,
    tags: ["أخشاب", "خشب", "أثاث"],
    createdAt: "2026-02-10",
  },
  {
    id: 5,
    name: "أعمال سباكة",
    description: "خدمات السباكة وإعداد المواسير",
    type: "service",
    usageCount: 15,
    tags: ["سباكة", "مواسير", "صرف"],
    createdAt: "2026-03-05",
  },
  {
    id: 6,
    name: "مواد عازلة",
    description: "مواد العزل الحراري والمائي",
    type: "resource",
    usageCount: 7,
    tags: ["عزل", "حراري", "مائي"],
    createdAt: "2026-03-12",
  },
  {
    id: 7,
    name: "أعمال لحام",
    description: "خدمات اللحام المетالي والميكانيكي",
    type: "service",
    usageCount: 6,
    tags: ["لحام", "ميتال", "حديد"],
    createdAt: "2026-04-01",
  },
  {
    id: 8,
    name: "بلاط وسيراميك",
    description: "بلاط وسيراميك بأحجام وأنماط مختلفة",
    type: "resource",
    usageCount: 11,
    tags: ["بلاط", "سيراميك", "أرضيات"],
    createdAt: "2026-04-15",
  },
];
