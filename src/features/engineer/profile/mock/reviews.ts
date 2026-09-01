import type { PublicEngineerReview } from "../api/types";

export const MOCK_ENGINEER_REVIEWS: PublicEngineerReview[] = [
  {
    id: 1,
    authorName: "خالد العمري",
    rating: 5,
    comment: "عمل ممتاز في صب الأساسات والتشطيبات. التزام تام بالمواصفات الفنية والجودة العالية.",
    createdAt: "2026-06-15T10:30:00Z",
  },
  {
    id: 2,
    authorName: "Sara Al-Hakim",
    rating: 5,
    comment: "التزام بالمواعيد واحترافية عالية. فريق العمل كان منظماً والنتائج فاقت التوقعات.",
    createdAt: "2026-05-20T14:15:00Z",
  },
  {
    id: 3,
    authorName: "محمد الخطيب",
    rating: 4.5,
    comment: "فريق عمل متميز ونتائج رائعة في مشروع تجديد المبنى السكني. أنصح بالتعامل معه.",
    createdAt: "2026-04-10T09:00:00Z",
  },
  {
    id: 4,
    authorName: "Ahmad Rizk",
    rating: 4,
    comment: "كانت التجربة جيدة بشكل عام. تم الانتهاء من العمل في الوقت المحدد وبجودة مقبولة.",
    createdAt: "2026-03-05T16:45:00Z",
  },
  {
    id: 5,
    authorName: "نور الدين بيسار",
    rating: 5,
    comment: "محترف جداً في التعامل مع المشاريع الإنشائية. يهتم بأدق التفاصيل ويقدم حلولاً إبداعية.",
    createdAt: "2026-01-22T11:20:00Z",
  },
  {
    id: 6,
    authorName: "Rami Yousef",
    rating: 4.5,
    comment: "عمل احترافي في أعمال الهيكل الإنشائي، والتواصل كان واضحاً طوال فترة المشروع.",
    createdAt: "2025-12-01T08:00:00Z",
  },
];

export const MOCK_REVIEW_STATS: {
  averageRating: number;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
} = {
  averageRating: 4.7,
  totalReviews: 12,
  distribution: {
    5: 7,
    4: 3,
    3: 1,
    2: 1,
    1: 0,
  },
};
