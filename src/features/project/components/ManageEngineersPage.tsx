import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, ScrollText, UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";
import Engineers from "@/features/projects-engineers/components/Engineers";
import EngineersLogs from "@/features/projects-engineers/components/EngineersLogs";
import EmploingRequests from "@/features/projects-engineers/components/EmploingRequests";

const ManageEngineersPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <Tabs
        defaultValue="search-engineers"
        className="mt-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <TabsList className="mb-1" dir={isArabic ? "rtl" : "ltr"}>
          <TabsTrigger value="search-engineers">
            <UserCog className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("projectsEngineers.tabs.search", "Search Engineers")}
          </TabsTrigger>
          <TabsTrigger value="emploing-requests">
            <ClipboardList
              className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`}
            />
            {t("projectsEngineers.tabs.emploingRequests", "Employing Requests")}
          </TabsTrigger>
          <TabsTrigger value="engineers-logs">
            <ScrollText
              className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`}
            />
            {t("projectsEngineers.tabs.logs", "Logs")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search-engineers">
          <Engineers />
        </TabsContent>

        <TabsContent value="emploing-requests">
          <EmploingRequests />
        </TabsContent>

        <TabsContent value="engineers-logs">
          <EngineersLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageEngineersPage;
