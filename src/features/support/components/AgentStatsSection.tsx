import KpiCard from "@/components/shared/KpiCard";
import { CheckCircle2, Clock, Flame, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { mockAgentStats } from "../mock";

const AgentStatsSection = () => {
  const { t } = useTranslation();
  const stats = mockAgentStats;

  const cards = [
    {
      icon: Inbox,
      label: t("support.agent.stats.open"),
      value: String(stats.open_tickets),
      count: stats.open_tickets,
      accent: "bg-indigo-500/10 text-indigo-600",
    },
    {
      icon: Clock,
      label: t("support.agent.stats.pendingCustomer"),
      value: String(stats.pending_customer),
      count: stats.pending_customer,
      accent: "bg-amber-500/10 text-amber-600",
    },
    {
      icon: Flame,
      label: t("support.agent.stats.urgent"),
      value: String(stats.urgent_tickets),
      count: stats.urgent_tickets,
      accent: "bg-rose-500/10 text-rose-600",
    },
    {
      icon: CheckCircle2,
      label: t("support.agent.stats.resolvedToday"),
      value: String(stats.resolved_today),
      count: stats.resolved_today,
      accent: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <KpiCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          accent={card.accent}
          hint={t("support.agent.stats.count", { count: card.count })}
        />
      ))}
    </div>
  );
};

export default AgentStatsSection;
