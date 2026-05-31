import { Outlet } from "react-router";
import Navbar from "@/components/common/Navbar";

const ApplicationLayout = () => {
  return (
    <div className="min-h-screen bg-background text-slate-950">
      <Navbar />

      <main className="mt-10 mx-auto w-[95%]  md:max-w-380">
        <Outlet />
      </main>
      {/* <Foooter /> */}
    </div>
  );
};

export default ApplicationLayout;
