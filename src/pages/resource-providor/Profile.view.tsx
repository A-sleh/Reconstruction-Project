import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, BriefcaseBusiness, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/features/resource-providor/profile/components/Header";
import AccountTab from "@/features/resource-providor/profile/components/AccountTab";
import WorkTab from "@/features/resource-providor/profile/components/WorkTab";
import SettingsTab from "@/features/resource-providor/profile/components/SettingsTab";

type TabKey = "account" | "work" | "settings";

export default function Profile() {
  const { t } = useTranslation();
  const [active, setActive] = useState<TabKey>("account");

  const tabs: { key: TabKey; label: string; icon: typeof User }[] = [
    { key: "account", label: t("resourceProvidor.profile.tabs.account"), icon: User },
    { key: "work", label: t("resourceProvidor.profile.tabs.work"), icon: BriefcaseBusiness },
    { key: "settings", label: t("resourceProvidor.profile.tabs.settings"), icon: Settings },
  ];


  return (
    <div>
      <Header />
      <div className="grid gap-3 md:grid-cols-[260px_1fr] mt-4">
        <aside className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm ">
          <nav className="flex flex-col gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main
          className="rounded-lg border bg-white border-gray-300 p-6 shadow-sm md:p-8 animate-in fade-in-50 duration-300"
          key={active}
        >
          {active === "account" && <AccountTab />}
          {active === "work" && <WorkTab />}
          {active === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
