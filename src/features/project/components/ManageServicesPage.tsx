import { ClipboardList, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllProvidorItems from "@/features/work-site-items/components/AllProvidorItems";

import ProjectOrdersTracker from "./ProjectOrdersTracker";

interface ManageServicesPageProps {
  projectId: number;
  projectName: string;
}

const ManageServicesPage = ({
  projectId,
  projectName,
}: ManageServicesPageProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <Tabs defaultValue="add-service" dir={isArabic ? "rtl" : "ltr"}>
        <TabsList className="mb-1" dir={isArabic ? "rtl" : "ltr"}>
          <TabsTrigger value="add-service">
            <Wrench className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
            {t("project.details.manageServices.tabs.addService")}
          </TabsTrigger>
          <TabsTrigger value="my-orders">
            <ClipboardList
              className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`}
            />
            {t("project.details.manageServices.tabs.myOrders")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-service">
          <AllProvidorItems
            projectId={projectId}
            projectName={projectName}
            providerType="Service"
          />
        </TabsContent>

        <TabsContent value="my-orders">
          <ProjectOrdersTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageServicesPage;
