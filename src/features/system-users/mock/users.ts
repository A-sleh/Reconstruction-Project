export interface SystemUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  personalIdentifier: string;
  avatarUrl: string;
  isActive: boolean;
}

export const MOCK_USERS: SystemUser[] = [
  {
    id: 1,
    firstName: "عبدالفتاح",
    lastName: "عصلة",
    email: "abdelfattah@example.com",
    phoneNumber: "+963 912 345 678",
    role: "مستثمر",
    personalIdentifier: "INV-10234",
    avatarUrl: "https://i.pravatar.cc/150?u=1",
    isActive: true,
  },
  {
    id: 2,
    firstName: "محمد",
    lastName: "أحمد",
    email: "mohammed@example.com",
    phoneNumber: "+963 933 221 100",
    role: "مهندس مدني",
    personalIdentifier: "ENG-20411",
    avatarUrl: "https://i.pravatar.cc/150?u=2",
    isActive: true,
  },
  {
    id: 3,
    firstName: "سارة",
    lastName: "خالد",
    email: "sara@example.com",
    phoneNumber: "+963 944 556 778",
    role: "مزود خدمات",
    personalIdentifier: "SVP-30877",
    avatarUrl: "https://i.pravatar.cc/150?u=3",
    isActive: false,
  },
  {
    id: 4,
    firstName: "أحمد",
    lastName: "محمد",
    email: "ahmed@example.com",
    phoneNumber: "+963 955 112 334",
    role: "مزود موارد",
    personalIdentifier: "RSP-40592",
    avatarUrl: "https://i.pravatar.cc/150?u=4",
    isActive: true,
  },
  {
    id: 5,
    firstName: "ليلى",
    lastName: "عمر",
    email: "layla@example.com",
    phoneNumber: "+963 966 889 900",
    role: "مستثمر",
    personalIdentifier: "INV-50314",
    avatarUrl: "https://i.pravatar.cc/150?u=5",
    isActive: true,
  },
  {
    id: 6,
    firstName: "خالد",
    lastName: "سليمان",
    email: "khaled@example.com",
    phoneNumber: "+963 977 443 221",
    role: "مهندس مدني",
    personalIdentifier: "ENG-60788",
    avatarUrl: "https://i.pravatar.cc/150?u=6",
    isActive: false,
  },
  {
    id: 7,
    firstName: "نور",
    lastName: "الدين",
    email: "nour@example.com",
    phoneNumber: "+963 988 776 554",
    role: "مزود خدمات",
    personalIdentifier: "SVP-70123",
    avatarUrl: "https://i.pravatar.cc/150?u=7",
    isActive: true,
  },
  {
    id: 8,
    firstName: "عمر",
    lastName: "حسن",
    email: "omar@example.com",
    phoneNumber: "+963 999 110 223",
    role: "مزود موارد",
    personalIdentifier: "RSP-80456",
    avatarUrl: "https://i.pravatar.cc/150?u=8",
    isActive: true,
  },
];
