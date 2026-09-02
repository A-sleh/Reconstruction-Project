import { useEffect, useState } from "react";

import { useEngineerProfile } from "@/features/engineer/profile/api/query";
import type { EngineerProfile } from "@/features/engineer/profile/api/engineer-profile";
import ProfileHeader from "@/features/engineer/profile/components/ProfileHeader";
import ProfileTabs from "@/features/engineer/profile/components/ProfileTabs";
import { MOCK_ENGINEER_PROFILE } from "@/features/engineer/profile/mock/profile";

const EngineerProfilePage = () => {
  const { data, isLoading } = useEngineerProfile();

  const [profile, setProfile] = useState<EngineerProfile>(data ?? MOCK_ENGINEER_PROFILE);

  useEffect(() => {
    if (data) setProfile(data);
  }, [data]);

  const handleUpdate = (updates: Partial<EngineerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        isLoading={isLoading}
        onUpdate={handleUpdate}
      />
      <ProfileTabs />
    </div>
  );
};

export default EngineerProfilePage;
