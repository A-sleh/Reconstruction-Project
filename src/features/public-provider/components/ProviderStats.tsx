import { Boxes, FileSpreadsheet, Home, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import StatCard from "@/components/shared/StatCard";
import { fmtCurrency } from "@/lib/helpers";
import type { PublicProviderProfile } from "../api/types";

interface ProviderStatsProps {
  provider: PublicProviderProfile;
}

export default function ProviderStats({ provider }: ProviderStatsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Home className="h-4 w-4" />,
      label: t("publicProvider.stats.workSites"),
      value: String(provider.workSitesCount),
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: <Boxes className="h-4 w-4" />,
      label: t("publicProvider.stats.inventory"),
      value: String(provider.inventoryCount),
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: t("publicProvider.stats.fulfillment"),
      value: `${provider.fulfillmentRate}%`,
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
    },
    {
      icon: <FileSpreadsheet className="h-4 w-4" />,
      label: t("publicProvider.stats.totalInvoiced"),
      value: fmtCurrency(provider.totalInvoiced),
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
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
