import { useEffect, useState } from "react";

import type { EngineerProfile } from "@/features/engineer/profile/api/engineer-profile";
import { useEngineerProfile } from "@/features/engineer/profile/api/query";
import ProfileHeader from "@/features/engineer/profile/components/ProfileHeader";
import ProfileTabs from "@/features/engineer/profile/components/ProfileTabs";
import { MOCK_ENGINEER_PROFILE } from "@/features/engineer/profile/mock/profile";
import useAuthStore from "@/stores/useAuthStore";

const EngineerProfilePage = () => {
  const { data, isLoading } = useEngineerProfile();
  const role = useAuthStore((s) => s.role);
  const canEdit = role === "Engineer";

  const [profile, setProfile] = useState<EngineerProfile>(
    data ?? MOCK_ENGINEER_PROFILE,
  );

  useEffect(() => {
    if (data) setProfile(data);
  }, [data]);

  const handleUpdate = (updates: Partial<EngineerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleAddPortfolio = (portfolio: EngineerProfile["portfolios"][number]) => {
    setProfile((prev) => ({ ...prev, portfolios: [...prev.portfolios, portfolio] }));
  };

  const handleUpdatePortfolio = (
    portfolio: EngineerProfile["portfolios"][number],
  ) => {
    setProfile((prev) => ({
      ...prev,
      portfolios: prev.portfolios.map((p) =>
        p.id === portfolio.id ? portfolio : p,
      ),
    }));
  };

  const handleDeletePortfolio = (id: number | string) => {
    setProfile((prev) => ({
      ...prev,
      portfolios: prev.portfolios.filter((p) => p.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        isLoading={isLoading}
        onUpdate={handleUpdate}
      />
      <ProfileTabs
        profile={profile}
        canEdit={canEdit}
        onAddPortfolio={handleAddPortfolio}
        onUpdatePortfolio={handleUpdatePortfolio}
        onDeletePortfolio={handleDeletePortfolio}
      />
    </div>
  );
};

export default EngineerProfilePage;
