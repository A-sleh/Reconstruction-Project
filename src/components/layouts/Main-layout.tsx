import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/common/Navbar";

const ApplicationLayout = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar" : "en";
  const userRole: "resourceProvidor" = "resourceProvidor";

  const handleLanguageChange = () => {
    i18n.changeLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar
        userRole={userRole}
        userName="Sara"
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ApplicationLayout;
