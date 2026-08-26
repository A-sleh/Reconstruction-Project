import type { EmploersActionsLogs } from "../api/types";
import type { EngineersProjectAction } from "../api/types";
import { MOCK_ENGINEERS } from "./mockEngineers";

const log = (
  id: number,
  engineerIndex: number,
  action: EngineersProjectAction,
  description: string,
  workSite: string,
  createdAt: string,
): EmploersActionsLogs => ({
  id,
  engineerId: MOCK_ENGINEERS[engineerIndex],
  action,
  description,
  workSite,
  createdAt: new Date(createdAt),
});

export const MOCK_EMPLOERS_ACTIONS_LOGS: EmploersActionsLogs[] = [
  log(
    1,
    0,
    "checked_in",
    "وصل إلى الموقع وسجل حضور صباح العمل.",
    "برج المزة - الطابق الثالث",
    "2026-08-24T07:58:00",
  ),
  log(
    2,
    1,
    "daily_report",
    "رفع التقرير اليومي لأعمال الصب وعدد العمال الحاضرين.",
    "برج المزة - الطابق الثالث",
    "2026-08-24T16:20:00",
  ),
  log(
    3,
    2,
    "progress_update",
    "حدّث نسبة إنجاز أعمال الهيكل الإنشائي إلى 65%.",
    "مبنى الشفاء السكني",
    "2026-08-23T11:45:00",
  ),
  log(
    4,
    3,
    "site_photos",
    "أضاف 12 صورة توثيقية لاعمال العزل الحراري.",
    "مبنى الشفاء السكني",
    "2026-08-23T13:10:00",
  ),
  log(
    5,
    4,
    "material_request",
    "طلب توريد 40 كيس أسمنت بورتلاندي للموقع.",
    "مشروع ريف دمشق - الفلل",
    "2026-08-22T09:05:00",
  ),
  log(
    6,
    1,
    "task_completed",
    "أنهى مهمة اعتماد مخططات التمديدات الكهربائية.",
    "برج المزة - الطابق الثاني",
    "2026-08-21T15:30:00",
  ),
  log(
    7,
    2,
    "invoice_added",
    "سجل فاتورة أعمال إضافية بقيمة 2,500,000 ل.س.",
    "مبنى الشفاء السكني",
    "2026-08-20T12:00:00",
  ),
  log(
    8,
    0,
    "checked_out",
    "انصرف من الموقع بعد اعتماد خطة اليوم التالي.",
    "برج المزة - الطابق الثالث",
    "2026-08-24T17:05:00",
  ),
  log(
    9,
    4,
    "site_photos",
    "وثّق أعمال الحفر بالصور قبل صب القاعدة.",
    "مشروع ريف دمشق - الفلل",
    "2026-08-19T10:25:00",
  ),
];
