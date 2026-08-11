import type { CannedResponse, CannedResponsesResponse } from "../api/types";

export const mockCannedResponses: CannedResponse[] = [
  {
    id: "id_request",
    title: "طلب صورة الهوية الوطنية الرسمية",
    content:
      "عزيزي العميل، نرجو منك إرفاق صورة طبق الأصل من الهوية الوطنية لتستكمل العملية.",
  },
  {
    id: "bank_delay",
    title: "التأكيد على استلام طلب السحب المالي",
    content:
      "أهلاً بك، تم استلام طلب السحب وهو حالياً قيد المراجعة مع البنك.",
  },
  {
    id: "resolved",
    title: "تأكيد حل المشكلة بنجاح",
    content: "نود إعلامك أنه تم حل المشكلة بنجاح. نعتذر عن أي إزعاج.",
  },
];

export const mockCannedResponsesResponse: CannedResponsesResponse = {
  data: mockCannedResponses,
};
