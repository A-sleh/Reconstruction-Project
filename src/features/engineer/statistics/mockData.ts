import { MOCK_ENGINEER_PROJECTS } from "@/features/engineer/profile/mock/projects";
import { MOCK_EXPERIENCE } from "@/features/engineer/profile/mock/experience";
import { MOCK_PORTFOLIO_SKILLS } from "@/features/engineer/profile/mock/skills";
import type { EngineerStatistics } from "./api/types";

export const mockEngineerStatistics: EngineerStatistics = {
  kpi: {
    totalProjects: MOCK_ENGINEER_PROJECTS.length,
    completed: MOCK_ENGINEER_PROJECTS.filter((p) => p.status === "COMPLETED")
      .length,
    inProgress: MOCK_ENGINEER_PROJECTS.filter(
      (p) => p.status === "IN_PROGRESS",
    ).length,
    planning: MOCK_ENGINEER_PROJECTS.filter((p) => p.status === "PLANNING")
      .length,
    totalBudget: MOCK_ENGINEER_PROJECTS.reduce((acc, p) => acc + p.budget, 0),
    yearsOfExperience: 8,
    rating: 4.3,
    reviewsCount: 12,
    pendingInvites: 2,
  },
  projectsByStatus: [
    { status: "COMPLETED", count: 3 },
    { status: "IN_PROGRESS", count: 2 },
    { status: "PLANNING", count: 2 },
  ],
  monthlyActivity: [
    { label: "2025-09", started: 1, completed: 0 },
    { label: "2025-10", started: 0, completed: 0 },
    { label: "2025-11", started: 1, completed: 0 },
    { label: "2025-12", started: 0, completed: 1 },
    { label: "2026-01", started: 1, completed: 0 },
    { label: "2026-02", started: 0, completed: 1 },
    { label: "2026-03", started: 0, completed: 1 },
    { label: "2026-04", started: 1, completed: 0 },
  ],
  budgetByCategory: [
    { category: "سكني", totalBudget: 2950000 },
    { category: "تعليمي", totalBudget: 420000 },
    { category: "بنية تحتية", totalBudget: 1200000 },
    { category: "تراثي", totalBudget: 310000 },
    { category: "صناعي", totalBudget: 650000 },
  ],
  reviews: [
    {
      id: 1,
      authorName: "جمعية الأمانة السكنية",
      rating: 5,
      comment:
        "أثبت المهندس أحمد كفاءة عالية في إدارة أعمال الترميم، والتزم بالجداول الزمنية بدقة.",
      createdAt: "2025-12-10",
    },
    {
      id: 2,
      authorName: "مديرية التربية بحلب",
      rating: 4,
      comment:
        "إشراف هندسي ممتاز على بناء المدرسة، وتقارير دورية واضحة ومفيدة.",
      createdAt: "2025-07-22",
    },
    {
      id: 3,
      authorName: "مجلس مدينة حلب",
      rating: 4,
      comment:
        "خبرة جيدة في مشاريع البنية التحتية، وتجاوب سريع مع ملاحظات الجهة المالكة.",
      createdAt: "2026-01-18",
    },
  ],
  upcomingDeadlines: [
    {
      projectId: "p5",
      title: "مجمع صناعي صغير لصناعة البلوك",
      client: "شركة العمران للصناعة",
      location: "حلب - الشيخ نجار",
      endDate: "2026-08-01",
      daysLeft: 12,
    },
    {
      projectId: "p1",
      title: "إعادة تأهيل برج سكني في حلب",
      client: "جمعية الأمانة السكنية",
      location: "حلب - الجميلية",
      endDate: "2026-10-15",
      daysLeft: 44,
    },
    {
      projectId: "p6",
      title: "مجمع سكني متكامل لذوي الشهداء",
      client: "مؤسسة الإسكان",
      location: "حلب - الليرمون",
      endDate: "2026-12-01",
      daysLeft: 91,
    },
  ],
  experience: MOCK_EXPERIENCE,
  skills: MOCK_PORTFOLIO_SKILLS.skills,
  certifications: MOCK_PORTFOLIO_SKILLS.certifications,
};