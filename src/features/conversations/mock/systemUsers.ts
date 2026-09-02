import type { SystemUser } from "../api/types";

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 5, firstName: "باسل", lastName: "عيتاني", role: "Investor", title: "مستثمر", isOnline: false },
  { id: 6, firstName: "نور", lastName: "الدين", role: "Investor", title: "مستثمر", isOnline: true },
  { id: 7, firstName: "ريم", lastName: "سليمان", role: "Investor", title: "مستثمرة", isOnline: false },
  { id: 8, firstName: "سميرة", lastName: "الحموي", role: "Engineer", title: "مهندسة معمارية", isOnline: true },
  { id: 9, firstName: "عمر", lastName: "قباني", role: "Engineer", title: "مهندس إنشائي", isOnline: true },
  { id: 10, firstName: "سارة", lastName: "منصور", role: "Engineer", title: "مهندسة مدنية", isOnline: false },
  { id: 11, firstName: "يوسف", lastName: "ناصر", role: "Engineer", title: "مهندس موقع", isOnline: true },
  { id: 12, firstName: "أحمد", lastName: "الخطيب", role: "Investor", title: "المالك", isOnline: true },
  { id: 20, firstName: "لينا", lastName: "حداد", role: "Provider", title: "مقاولة أعمال إنشائية", providerRole: "Resource", isOnline: true },
  { id: 21, firstName: "وسام", lastName: "خليل", role: "Provider", title: "مقاول بناء", providerRole: "Service", isOnline: false },
  { id: 22, firstName: "هبة", lastName: "الرفاعي", role: "Provider", title: "موردة معدات", providerRole: "Resource", isOnline: true },
  { id: 23, firstName: "خالد", lastName: "العبد", role: "Provider", title: "مورد مواد إنشائية", providerRole: "Resource", isOnline: false },
  { id: 30, firstName: "منى", lastName: "كحيل", role: "Admin", title: "مديرة المحتوى", isOnline: false },
  { id: 31, firstName: "فارس", lastName: "الحلبي", role: "Admin", title: "مدير التحقق", isOnline: true },
  { id: 32, firstName: "مازن", lastName: "الصالح", role: "Admin", title: "مدير النظام", isOnline: true },
];