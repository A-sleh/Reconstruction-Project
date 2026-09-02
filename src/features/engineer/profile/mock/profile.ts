import type { EngineerProfile } from "../api/engineer-profile";

export const MOCK_ENGINEER_PROFILE: EngineerProfile = {
  engineerId: 1,
  firstName: "Ahmad",
  lastName: "Yousef",
  email: "ahmad.yousef@example.com",
  phone: "+962790000000",
  photo: null,
  identifier: "ENG-000123",
  syndicateId: 45213,
  speciality: "CivilEngineer",
  professionalInfo: {
    specialization: "CivilEngineer",
    licenseNumber: "JEA-88213",
    yearsOfExperiece: 8,
    bio: "مهندس مدني متخصص في الإشراف على بناء المنشآت السكنية وإعادة تأهيل المباني المتضررة.",
  },
  verificationStatus: "VERIFIED",
  numberOfProjectsContributed: 12,
  portfolios: [
    {
      id: 1,
      title: "ترميم المبنى السكني في حي العزيزية",
      description:
        "إعادة تأهيل مبنى سكني متضرر يشمل التدعيم الإنشائي وأعمال التشطيبات الخارجية.",
      year: 2024,
      projectId: 101,
      attachments: [
        {
          id: 1,
          fileId: 5001,
          url: "https://example.com/portfolio/azizia-1.jpg",
          description: "صورة قبل الترميم",
        },
        {
          id: 2,
          fileId: 5002,
          url: "https://example.com/portfolio/azizia-2.jpg",
          description: "صورة بعد الترميم",
        },
      ],
    },
    {
      id: 2,
      title: "إنشاء مدرسة ابتدائية - حلب",
      description: "الإشراف على إنشاء مبنى مدرسي من الطوابق الثلاثة.",
      year: 2023,
      projectId: 102,
      attachments: [],
    },
  ],
  projects: [
    { projectId: 101, projectName: "ترميم المبنى السكني - العزيزية" },
    { projectId: 102, projectName: "مدرسة حلب الابتدائية" },
    { projectId: 103, projectName: "مستودع المواد - حريتان" },
  ],
};

export const MOCK_ENGINEER_PROFILE_PENDING: EngineerProfile = {
  ...MOCK_ENGINEER_PROFILE,
  engineerId: 2,
  firstName: "Layla",
  lastName: "Haddad",
  email: "layla.haddad@example.com",
  phone: "+963955123456",
  identifier: "ENG-000456",
  syndicateId: 90318,
  speciality: "Architect",
  professionalInfo: {
    specialization: "ArchitecturalEngineer",
    licenseNumber: "JEA-77451",
    yearsOfExperiece: 4,
    bio: "معمارية متخصصة في تصميم الأبنية السكنية والتجارية بأسلوب حديث يحافظ على الطابع المحلي.",
  },
  verificationStatus: "PENDING",
  numberOfProjectsContributed: 0,
  portfolios: [],
  projects: [],
};

export const MOCK_ENGINEER_PROFILE_REJECTED: EngineerProfile = {
  ...MOCK_ENGINEER_PROFILE,
  engineerId: 3,
  firstName: "Omar",
  lastName: "Khaled",
  email: "omar.khaled@example.com",
  phone: "+963933098765",
  identifier: "ENG-000789",
  syndicateId: 33452,
  speciality: "ElectricalEngineer",
  professionalInfo: {
    specialization: "ElectricalEngineer",
    licenseNumber: "JEA-55012",
    yearsOfExperiece: 11,
    bio: "مهندس كهرباء بخبرة واسعة في شبكات الطاقة والتغذية الكهربائية للمنشآت الصناعية.",
  },
  verificationStatus: "REJECTED",
  numberOfProjectsContributed: 0,
  portfolios: [],
  projects: [],
};
