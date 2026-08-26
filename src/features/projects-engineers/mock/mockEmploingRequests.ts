import { EmploingRequestStatus } from "../api/types";
import type { EmploingRequests } from "../api/types";

import type { EngineerSummery } from "../api/types";

const engineer = (
  overrides: Partial<EngineerSummery> = {},
): EngineerSummery => ({
  id: 1,
  fullName: "أحمد الخطيب",
  imageUrl: "",
  spec: "Structural Engineering",
  yearsOfExperiance: 8,
  contactNumber: "+963991234567",
  numberOfCompletedProjects: 24,
  location: "دمشق",
  address: "دمشق - المزة",
  rate: 4.6,
  isAvilable: true,
  ...overrides,
});

export const MOCK_EMPLOING_REQUESTS: EmploingRequests[] = [
  {
    id: 101,
    requestNote: "نحتاج مهندس إنشائي للإشراف على صب الأساسات في مشروع المزة.",
    engineer: engineer({ id: 1, fullName: "أحمد الخطيب" }),
    status: EmploingRequestStatus.APPROVED,
    rejectedCause: "",
    approvedDate: new Date("2026-08-12"),
    createdAt: new Date("2026-08-05"),
  },
  {
    id: 102,
    requestNote: "مطلوب مهندس معماري لتصميم واجهات مبنى سكني خمس طوابق.",
    engineer: engineer({
      id: 2,
      fullName: "سارة العلي",
      spec: "Architectural Design",
      rate: 4.9,
      isAvilable: false,
    }),
    status: EmploingRequestStatus.PENDING,
    rejectedCause: "",
    approvedDate: new Date(0),
    createdAt: new Date("2026-08-18"),
  },
  {
    id: 103,
    requestNote: "إشراف مدني يومي على أعمال الحفر والجدران الاستنادية.",
    engineer: engineer({
      id: 3,
      fullName: "خالد الحسيني",
      spec: "Civil Engineering",
      yearsOfExperiance: 12,
      location: "حلب",
    }),
    status: EmploingRequestStatus.REJECTED,
    rejectedCause: "المهندس غير متاح خلال فترة المشروع.",
    approvedDate: new Date(0),
    createdAt: new Date("2026-07-30"),
  },
  {
    id: 104,
    requestNote: "تمت تسوية الطلب مع المهندس مباشرة خارج المنصة.",
    engineer: engineer({
      id: 4,
      fullName: "ريم منصور",
      spec: "Electrical Engineering",
      rate: 4.2,
    }),
    status: EmploingRequestStatus.CANCELED,
    rejectedCause: "",
    approvedDate: new Date(0),
    createdAt: new Date("2026-07-21"),
  },
  {
    id: 105,
    requestNote: "مطلوب مهندس ميكانيكي لأنظمة التدفئة في برج تجاري.",
    engineer: engineer({
      id: 5,
      fullName: "عمر قصاب",
      spec: "Mechanical Engineering",
      yearsOfExperiance: 15,
      location: "حمص",
      rate: 4.8,
    }),
    status: EmploingRequestStatus.PENDING,
    rejectedCause: "",
    approvedDate: new Date(0),
    createdAt: new Date("2026-08-20"),
  },
];
