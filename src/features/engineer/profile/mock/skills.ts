import type { EngineerPortfolioSkills } from "../api/types";

export const MOCK_PORTFOLIO_SKILLS: EngineerPortfolioSkills = {
  skills: [
    "AutoCAD",
    "Revit",
    "ETABS",
    "SketchUp",
    "إدارة المشاريع",
    "الخرسانة المسلحة",
    "البنية التحتية",
    "التصميم الإنشائي",
    "حساب الأحمال",
    "إعداد الدراسات",
  ],
  certifications: [
    {
      id: "cert1",
      name: "رخصة ممارسة المهنة الهندسية",
      issuer: "نقابة المهندسين السوريين",
      year: 2017,
    },
    {
      id: "cert2",
      name: "شهادة إدارة المشاريع الاحترافية PMP",
      issuer: "معهد إدارة المشاريع PMI",
      year: 2020,
    },
    {
      id: "cert3",
      name: "دورة التصميم المقاوم للزلازل",
      issuer: "الهيئة العامة للإسكان",
      year: 2022,
    },
  ],
};