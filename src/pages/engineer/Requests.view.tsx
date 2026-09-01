import { useTranslation } from "react-i18next";
import { Inbox, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EngineerRequestsStatsBar from "@/features/engineer/projects/components/EngineerRequestsStatsBar";
import UpComingInvetationRequest from "@/features/engineer/projects/components/UpComingInvetationRequest";
import Projects from "@/features/engineer/projects/components/Projects";
import { MOCK_ENGINEER_REQUESTS_STATS } from "@/features/engineer/projects/mock/mockRequests";

const EngineerRequests = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Inbox className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">
            {t("engineerRequests.page.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("engineerRequests.page.subtitle")}
          </p>
        </div>
      </div>

      <EngineerRequestsStatsBar
        stats={MOCK_ENGINEER_REQUESTS_STATS}
        isLoading={false}
      />

      <Tabs defaultValue="invites" dir={isArabic ? "rtl" : "ltr"}>
        <TabsList>
          <TabsTrigger value="invites" className="gap-2">
            <Inbox className="h-4 w-4" />
            {t("engineerRequests.section.invites.title")}
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <Send className="h-4 w-4" />
            {t("engineerRequests.section.requests.title")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="invites" className="mt-5">
          <UpComingInvetationRequest />
        </TabsContent>
        <TabsContent value="requests" className="mt-5">
          <Projects />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EngineerRequests;
