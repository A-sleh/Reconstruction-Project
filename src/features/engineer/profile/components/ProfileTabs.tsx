import { Award, FolderOpen, Layers, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
  EngineerPortfolio,
  EngineerProfile,
} from "../api/engineer-profile";
import BioSection from "./BioSection";
import PortfolioSection from "./PortfolioSection";

interface Props {
  profile: EngineerProfile;
  canEdit?: boolean;
  onAddPortfolio?: (portfolio: EngineerPortfolio) => void;
  onUpdatePortfolio?: (portfolio: EngineerPortfolio) => void;
  onDeletePortfolio?: (id: number | string) => void;
}

const ProfileTabs = ({
  profile,
  canEdit = false,
  onAddPortfolio,
  onUpdatePortfolio,
  onDeletePortfolio,
}: Props) => {
  const { t } = useTranslation();

  const tabs = [
    { value: "bio", label: t("engineerProfile.tabs.bio"), icon: UserRound },
    {
      value: "portfolio",
      label: t("engineerProfile.tabs.portfolio"),
      icon: FolderOpen,
    },
    {
      value: "projects",
      label: t("engineerProfile.tabs.projects"),
      icon: Layers,
    },
    { value: "rating", label: t("engineerProfile.tabs.rating"), icon: Award },
  ];

  return (
    <Tabs defaultValue="bio">
      <TabsList className="w-full  h-auto sm:h-10 bg-white p-1 gap-1 overflow-x-auto ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 whitespace-nowrap rounded-full"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="bio" className="mt-6">
        <BioSection profile={profile} />
      </TabsContent>

      <TabsContent value="portfolio" className="mt-6">
        <PortfolioSection
          profile={profile}
          canEdit={canEdit}
          onAdd={onAddPortfolio ?? (() => {})}
          onUpdate={onUpdatePortfolio ?? (() => {})}
          onDelete={onDeletePortfolio ?? (() => {})}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
