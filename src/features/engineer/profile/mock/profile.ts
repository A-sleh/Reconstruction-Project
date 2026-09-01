import type { EngineerProfile } from "../api/types";

export const MOCK_ENGINEER_PROFILE: EngineerProfile = {
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
};

export const MOCK_ENGINEER_PROFILE_PENDING: EngineerProfile = {
  ...MOCK_ENGINEER_PROFILE,
  first_name: "Layla",
  last_name: "Haddad",
  email: "layla.haddad@example.com",
  phone: "+963955123456",
  identifier: "ENG-000456",
  syndicate_id: "SYN-2025-0912",
  professionalInfo: {
    specialization: "ARCHITECTURE",
    licenseNumber: "JEA-77451",
    yearsOfExperience: 4,
    bio: "معمارية متخصصة في تصميم الأبنية السكنية والتجارية بأسلوب حديث يحافظ على الطابع المحلي.",
    employmentType: "FREELANCER",
  },
  verificationStatus: "PENDING",
  rating: 0,
  reviewsCount: 0,
};

export const MOCK_ENGINEER_PROFILE_REJECTED: EngineerProfile = {
  ...MOCK_ENGINEER_PROFILE,
  first_name: "Omar",
  last_name: "Khaled",
  email: "omar.khaled@example.com",
  phone: "+963933098765",
  identifier: "ENG-000789",
  syndicate_id: "SYN-2023-0345",
  professionalInfo: {
    specialization: "ELECTRICAL",
    licenseNumber: "JEA-55012",
    yearsOfExperience: 11,
    bio: "مهندس كهرباء بخبرة واسعة في شبكات الطاقة والتغذية الكهربائية للمنشآت الصناعية.",
    employmentType: "GOVERNMENT_EMPLOYEE",
  },
  verificationStatus: "REJECTED",
  rating: 0,
  reviewsCount: 0,
};
