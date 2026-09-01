import {
  BarChart3,
  ClipboardList,
  ScrollText,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EngineersDashboard from "@/features/projects-engineers/components/EngineersDashboard";
import EmploingRequests from "@/features/projects-engineers/components/EmploingRequests";
import Engineers from "@/features/projects-engineers/components/Engineers";
import EngineersLogs from "@/features/projects-engineers/components/EngineersLogs";
import EngineersPermissions from "@/features/projects-engineers/components/EngineersPermissions";

const ManageEngineersPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <Tabs defaultValue="dashboard" dir={isArabic ? "rtl" : "ltr"}>
        <TabsList className="mb-1" dir={isArabic ? "rtl" : "ltr"}>
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
            {t("projectsEngineers.tabs.dashboard", "Dashboard")}
          </TabsTrigger>
          <TabsTrigger value="emploing-requests">
            <ClipboardList
              className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`}
            />
            {t("projectsEngineers.tabs.emploingRequests", "Employing Requests")}
          </TabsTrigger>
          <TabsTrigger value="engineers-permissions">
            <ShieldCheck className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("projectsEngineers.tabs.permissions", "Permissions")}
          </TabsTrigger>
          <TabsTrigger value="engineers-logs">
            <ScrollText className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("projectsEngineers.tabs.logs", "Logs")}
          </TabsTrigger>
          <TabsTrigger value="search-engineers">
            <UserCog className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("projectsEngineers.tabs.search", "Search Engineers")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <EngineersDashboard />
        </TabsContent>

        <TabsContent value="search-engineers">
          <Engineers />
        </TabsContent>

        <TabsContent value="emploing-requests">
          <EmploingRequests />
        </TabsContent>

        <TabsContent value="engineers-logs">
          <EngineersLogs />
        </TabsContent>

        <TabsContent value="engineers-permissions">
          <EngineersPermissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageEngineersPage;
