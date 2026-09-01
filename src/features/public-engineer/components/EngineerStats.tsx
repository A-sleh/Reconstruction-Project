import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CheckCircle2,
  MessageSquareText,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import StatCard from "@/components/shared/StatCard";
import type { PublicEngineerProfile } from "@/features/engineer/profile/api/types";

export default function EngineerStats({
  engineer,
}: {
  engineer: PublicEngineerProfile;
}) {
  const { t } = useTranslation();

  const completedCount =
    engineer.recentProjects.filter((p) => p.status === "COMPLETED").length;
  const completedDisplay = Math.max(completedCount, 1);

  const stats = [
    {
      icon: <BriefcaseBusiness className="h-4 w-4" />,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      label: t("publicEngineer.stats.experience"),
      value: String(engineer.professionalInfo.yearsOfExperience),
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      label: t("publicEngineer.stats.projectsCompleted"),
      value: String(completedDisplay),
    },
    {
      icon: <Star className="h-4 w-4 fill-gold" />,
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
      label: t("publicEngineer.stats.rating"),
      value: engineer.rating.toFixed(1),
    },
    {
      icon: <MessageSquareText className="h-4 w-4" />,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      label: t("publicEngineer.stats.reviewsCount"),
      value: String(engineer.reviewsCount),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.06 }}
        >
          <StatCard
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        </motion.div>
      ))}
    </div>
  );
}
