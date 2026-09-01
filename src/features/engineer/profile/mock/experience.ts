import type { EngineerExperience } from "../api/types";

export const MOCK_EXPERIENCE: EngineerExperience[] = [
  {
    id: "exp1",
    jobTitle: "مهندس إنشائي أول",
    company: "شركة الأمل للهندسة والإنشاء",
    location: "حلب",
    startDate: "2021-06-01",
    endDate: null,
    description:
      "الإشراف على مشاريع إعادة الإعمار السكني والتجاري في حلب، إدارة فريق من المهندسين ومراجعة المخططات الإنشائية واللوحات الفنية.",
    isCurrent: true,
  },
  {
    id: "exp2",
    jobTitle: "مهندس مشاريع",
    company: "مؤسسة الإعمار للهندسة المدنية",
    location: "حلب",
    startDate: "2019-01-15",
    endDate: "2021-05-30",
    description:
      "تنفيذ مشاريع البنية التحتية وترميم المباني التاريخية، إعداد التقارير الفنية ومتابعة التعاقدات مع الجهات الحكومية.",
    isCurrent: false,
  },
  {
    id: "exp3",
    jobTitle: "مهندس موقع",
    company: "المكتب الهندسي الموحد",
    location: "إدلب",
    startDate: "2017-03-01",
    endDate: "2018-12-31",
    description:
      "المتابعة الميدانية لتنفيذ أعمال الخرسانة المسلحة والبنية التحتية للمباني السكنية الجديدة.",
    isCurrent: false,
  },
];