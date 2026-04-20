import { useState } from "react";
import { MdLanguage } from "react-icons/md";

const ToggleLanguage = () => {
  const [language, setLanguage] = useState("en");

  const onLanguageChange = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.lang = newLanguage;
  };

  return (
    <button
      type="button"
      onClick={onLanguageChange}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
    >
      <MdLanguage className="h-5 w-5 cursor-pointer" />
      {language === "en" ? "EN" : "AR"}
    </button>
  );
};

export default ToggleLanguage;
