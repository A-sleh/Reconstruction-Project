import type {
  EngineerInvite,
  EngineerJoinRequest,
  EngineerRequestsStats,
} from "../api/types";

export const MOCK_ENGINEER_INVITES: EngineerInvite[] = [
  {
    id: "inv-001",
    fromName: "أحمد الخطيب",
    fromTitle: "Project Owner",
    projectId: "proj-101",
    projectName: "مشروع المزة السكني",
    workSiteName: "الإشراف على الأعمال الإنشائية",
    message:
      "نبحث عن مهندس مشرف لمتابعة أعمال التنفيذ في المراحل الأخيرة للمشروع. نرحب بانضمامك لفريق العمل.",
    compensation: "1,500 USD / project",
    sentAt: "2026-08-20T09:30:00.000Z",
    status: "PENDING",
  },
  {
    id: "inv-002",
    fromName: "سامر الحموي",
    fromTitle: "Project Owner",
    projectId: "proj-102",
    projectName: "مشروع كسب السياحي",
    workSiteName: "الإشراف على أعمال البنية التحتية",
    message:
      "ننفذ مشروعاً سياحياً متكاملاً في كسب ونحتاج إلى خبرتك في الإشراف على التنسيقات والطبقات الأساسية.",
    compensation: "2,200 USD / project",
    sentAt: "2026-08-22T11:15:00.000Z",
    status: "PENDING",
  },
  {
    id: "inv-003",
    fromName: "خالد العبد",
    fromTitle: "Project Owner",
    projectId: "proj-103",
    projectName: "برج التجارة في حلب",
    workSiteName: "إفراغ البرج",
    message:
      "تم قبول طلبك للانضمام إلى مشروع برج التجارة. ننتظرك لبدء أعمال الإفراغ والتجهيز.",
    compensation: "3,000 USD / project",
    sentAt: "2026-08-18T08:00:00.000Z",
    status: "ACCEPTED",
  },
  {
    id: "inv-004",
    fromName: "مازن الصالح",
    fromTitle: "Project Owner",
    projectId: "proj-104",
    projectName: "مجمع الشام في حماة",
    workSiteName: "الإشراف على الأعمال الخرسانية",
    message:
      "نشكرك على اهتمامك، لكننا اخترنا حالياً مهندساً آخر لمرحلة الأعمال الخرسانية.",
    compensation: "1,800 USD / project",
    sentAt: "2026-08-15T14:45:00.000Z",
    status: "DECLINED",
  },
  {
    id: "inv-005",
    fromName: "باسل عيتاني",
    fromTitle: "Project Owner",
    projectId: "proj-105",
    projectName: "مشروع السفح السكني في دمشق",
    workSiteName: "الإشراف على التوريدات والمواد",
    message:
      "مشروع سكني جديد في منطقة السفح، نرغب بالإشراف على توريد المواد وضبط الجودة طوال فترة التنفيذ.",
    compensation: "2,500 USD / project",
    sentAt: "2026-08-24T10:20:00.000Z",
    status: "PENDING",
  },
];

export const MOCK_ENGINEER_JOIN_REQUESTS: EngineerJoinRequest[] = [
  {
    id: "req-001",
    projectId: "proj-201",
    projectName: "مشروع المزة السكني",
    workSiteName: "الإشراف على الأعمال الإنشائية",
    note: "أمتلك خبرة 8 سنوات في الإشراف على الأبنية السكنية، وأرغب بالانضمام لمتابعة الأعمال الإنشائية.",
    status: "PENDING",
    sentAt: "2026-08-25T09:00:00.000Z",
  },
  {
    id: "req-002",
    projectId: "proj-202",
    projectName: "برج التجارة في حلب",
    workSiteName: "إفراغ البرج",
    note: "خبرة واسعة في مشاريع الإفراغ للمباني عالية الأغبرة، جاهز للبدء فوراً.",
    status: "PENDING",
    sentAt: "2026-08-26T13:30:00.000Z",
  },
  {
    id: "req-003",
    projectId: "proj-203",
    projectName: "مجمع الشام في حماة",
    workSiteName: "الإشراف على الأعمال الكهربائية",
    note: "مهندس كهرباء مختص بمراقبة التركيبات الكهربائية للمجمعات التجارية.",
    status: "PENDING",
    sentAt: "2026-08-27T11:10:00.000Z",
  },
  {
    id: "req-004",
    projectId: "proj-204",
    projectName: "مشروع كسب السياحي",
    workSiteName: "الإشراف على أعمال التشطيبات",
    note: "تمت الموافقة على طلبي وسأبدأ أعمال الإشراف على التشطيبات بعد توقيع العقد.",
    status: "APPROVED",
    sentAt: "2026-08-19T14:00:00.000Z",
    repliedAt: "2026-08-21T10:00:00.000Z",
  },
  {
    id: "req-005",
    projectId: "proj-205",
    projectName: "مشروع السفح السكني في دمشق",
    workSiteName: "الإشراف على أعمال التدعيم",
    note: "طلب انضمام إلى مرحلة التدعيم الإنشائي للمباني السكنية.",
    status: "REJECTED",
    sentAt: "2026-08-16T08:45:00.000Z",
    repliedAt: "2026-08-18T12:30:00.000Z",
    rejectionReason: "تم اختيار مهندس ذو خبرة أكبر في أعمال التدعيم للمشروع.",
  },
];

export const MOCK_ENGINEER_REQUESTS_STATS: EngineerRequestsStats = {
  invites: {
    pending: MOCK_ENGINEER_INVITES.filter((i) => i.status === "PENDING").length,
    accepted: MOCK_ENGINEER_INVITES.filter((i) => i.status === "ACCEPTED").length,
    declined: MOCK_ENGINEER_INVITES.filter((i) => i.status === "DECLINED").length,
    total: MOCK_ENGINEER_INVITES.length,
  },
  requests: {
    pending: MOCK_ENGINEER_JOIN_REQUESTS.filter(
      (r) => r.status === "PENDING",
    ).length,
    approved: MOCK_ENGINEER_JOIN_REQUESTS.filter(
      (r) => r.status === "APPROVED",
    ).length,
    rejected: MOCK_ENGINEER_JOIN_REQUESTS.filter(
      (r) => r.status === "REJECTED",
    ).length,
    canceled: MOCK_ENGINEER_JOIN_REQUESTS.filter(
      (r) => r.status === "CANCELED",
    ).length,
    total: MOCK_ENGINEER_JOIN_REQUESTS.length,
  },
};
