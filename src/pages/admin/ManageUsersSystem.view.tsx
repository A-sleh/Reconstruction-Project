import UserKPISection from "@/features/system-users/components/UserKPISection";
import UsersTable from "@/features/system-users/components/UsersTable";

const ManageUsersSystem = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container py-8 space-y-8">
        <UserKPISection
          investors={5}
          resourceProviders={3}
          serviceProviders={4}
          engineers={8}
        />
        <UsersTable />
      </section>
    </div>
  );
};

export default ManageUsersSystem;
