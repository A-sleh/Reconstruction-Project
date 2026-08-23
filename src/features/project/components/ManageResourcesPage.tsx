import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectOrdersTracker from "./ProjectOrdersTracker";
import AllProvidorItems from "@/features/work-site-items/components/AllProvidorItems";
import { ClipboardList, PackagePlus } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      <Tabs
        defaultValue="add-resource"
        className="mt-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
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
        </TabsList>

        <TabsContent value="add-resource">
          <AllProvidorItems projectId={projectId} projectName={projectName} />
        </TabsContent>

        <TabsContent value="my-orders">
          <ProjectOrdersTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageResourcesPage;
