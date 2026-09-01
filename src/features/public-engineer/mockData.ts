import { MOCK_ENGINEER_PROJECTS } from "@/features/engineer/profile/mock/projects";
import type { PublicEngineerProfile } from "@/features/engineer/profile/api/types";

export const mockPublicEngineerProfile: PublicEngineerProfile = {
  id: "b3f1a2c4-5d6e-4f7a-8b9c-0d1e2f3a4b5c",
  first_name: "Ahmad",
  last_name: "Yousef",
  email: "ahmad.yousef@example.com",
  phone: "+962790000000",
  photo_url: null,
  identifier: "ENG-000123",
  speciality: "CIVIL",
  syndicate_id: "SYN-2024-0456",
  professionalInfo: {
    specialization: "CIVIL",
    licenseNumber: "JEA-88213",
    yearsOfExperience: 8,
    bio: "مهندس مدني متخصص في الإشراف على بناء المنشآت السكنية وإعادة تأهيل المباني المتضررة.",
    employmentType: "FIRM_EMPLOYEE",
  },
  verificationStatus: "VERIFIED",
  rating: 4.3,
  reviewsCount: 12,
  currentProject: MOCK_ENGINEER_PROJECTS[0],
  recentProjects: MOCK_ENGINEER_PROJECTS.slice(0, 3),
  reviews: [
    {
      id: 1,
      authorName: "جمعية الأمانة السكنية",
      rating: 5,
      comment:
        "أثبت المهندس أحمد كفاءة عالية في إدارة أعمال الترميم، والتزم بالجداول الزمنية بدقة مع مراعاة كافة المعايير الفنية.",
      createdAt: "2025-12-10",
    },
    {
      id: 2,
      authorName: "مديرية التربية بحلب",
      rating: 4,
      comment:
        "إشراف هندسي ممتاز على بناء المدرسة، ونماذج تقارير دورية كانت واضحة ومفيدة لمتابعة سير العمل.",
      createdAt: "2025-07-22",
    },
    {
      id: 3,
      authorName: "مجلس مدينة حلب",
      rating: 4,
      comment:
        "خبرة جيدة في مشاريع البنية التحتية، وتجاوب سريع مع ملاحظات الجهة المالكة أثناء التنفيذ.",
      createdAt: "2026-01-18",
    },
    {
      id: 4,
      authorName: "الأمانة العامة للمعالم التاريخية",
      rating: 5,
      comment:
        "تعامل مهني في ترميم المعالم التراثية مع الحفاظ على الطابع التاريخي، عمل رائع يستحق الثناء.",
      createdAt: "2025-03-05",
    },
  ],
};