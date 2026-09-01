import { BarChart3, ClipboardList, PackagePlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllProvidorItems from "@/features/work-site-items/components/AllProvidorItems";

import ProjectItemsDashboard from "../dashboard/components/ProjectItemsDashboard";
import ProjectOrdersTracker from "./ProjectOrdersTracker";

interface ManageResourcesPageProps {
  projectId: number;
  projectName: string;
}

const ManageResourcesPage = ({
  projectId,
  projectName,
}: ManageResourcesPageProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <Tabs defaultValue="add-resource" dir={isArabic ? "rtl" : "ltr"}>
        <TabsList className="mb-1" dir={isArabic ? "rtl" : "ltr"}>
          <TabsTrigger value="add-resource">
            <PackagePlus className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("project.details.manageResources.tabs.addResource")}
          </TabsTrigger>
          <TabsTrigger value="my-orders">
            <ClipboardList
              className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`}
            />
            {t("project.details.manageResources.tabs.myOrders")}
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("project.details.manageResources.tabs.statistics")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-resource">
          <AllProvidorItems
            projectId={projectId}
            projectName={projectName}
            providerType="Resource"
          />
        </TabsContent>

        <TabsContent value="my-orders">
          <ProjectOrdersTracker />
        </TabsContent>

        <TabsContent value="statistics">
          <ProjectItemsDashboard providerType="Resource" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageResourcesPage;
