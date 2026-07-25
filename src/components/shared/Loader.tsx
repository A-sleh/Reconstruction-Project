import { useTranslation } from "react-i18next";

const Loader = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {isArabic ? "جاري اتحميل ..." : "Loading ..."}
        </p>
      </div>
    </div>
  );
};

export default Loader;
