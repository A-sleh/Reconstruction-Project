import { useTranslation } from "react-i18next";
import AgentStatsSection from "@/features/support/components/AgentStatsSection";
import AgentTicketsTable from "@/features/support/components/AgentTicketsTable";

const AgentInBox = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div
      className="min-h-screen bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="container py-8 space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-gray-300 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
              {t("support.agent.inbox.badge")}
            </span>
            <h1 className="text-sm font-bold text-foreground">
              {t("support.agent.inbox.title")}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {t("support.agent.inbox.online", { name: "أحمد علي" })}
            </span>
          </div>
        </header>

        <AgentStatsSection />
        <AgentTicketsTable />
      </section>
    </div>
  );
};

export default AgentInBox;
