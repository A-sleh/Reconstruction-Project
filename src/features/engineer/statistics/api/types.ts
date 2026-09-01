import type {
  EngineerCertification,
  EngineerExperience,
  EngineerProjectStatus,
  PublicEngineerReview,
} from "@/features/engineer/profile/api/types";

export interface EngineerMonthlyActivity {
  label: string;
  started: number;
  completed: number;
}

export interface ProjectStatusSlice {
  status: EngineerProjectStatus;
  count: number;
}

export interface CategoryBudget {
  category: string;
  totalBudget: number;
}

export interface UpcomingDeadline {
  projectId: string;
  title: string;
  client: string;
  location: string;
  endDate: string;
  daysLeft: number;
}

export interface EngineerStatistics {
  kpi: {
    totalProjects: number;
    completed: number;
    inProgress: number;
    planning: number;
    totalBudget: number;
    yearsOfExperience: number;
    rating: number;
    reviewsCount: number;
    pendingInvites: number;
  };
  projectsByStatus: ProjectStatusSlice[];
  monthlyActivity: EngineerMonthlyActivity[];
  budgetByCategory: CategoryBudget[];
  reviews: PublicEngineerReview[];
  upcomingDeadlines: UpcomingDeadline[];
  experience: EngineerExperience[];
  skills: string[];
  certifications: EngineerCertification[];
}