import { ClipboardList, FileText, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewProjectReportsPage from "@/features/project-reports/components/NewProjectReportsPage";
import OrderReports from "@/features/project-reports/components/OrderReports";
import ProjectReports from "@/features/project-reports/components/ProjectReports";

const ManageReportsPage = ({ projectId }: { projectId: number }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <Tabs defaultValue="all-reports" dir={isArabic ? "rtl" : "ltr"}>
        <TabsList className="mb-1" dir={isArabic ? "rtl" : "ltr"}>
          <TabsTrigger value="all-reports">
            <FileText className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("project.details.manageReports.tabs.allReports")}
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ClipboardList
              className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`}
            />
            {t("project.details.manageReports.tabs.orders")}
          </TabsTrigger>
          <TabsTrigger value="create-report">
            <PlusCircle className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("project.details.manageReports.tabs.createReport")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-reports">
          <ProjectReports />
        </TabsContent>

        <TabsContent value="orders">
          <OrderReports />
        </TabsContent>

        <TabsContent value="create-report">
          <NewProjectReportsPage projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageReportsPage;
