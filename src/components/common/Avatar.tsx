import useAuthStore, { clearTokens } from "@/stores/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { errorToast, successToast } from "./Toast";

const Avatar = () => {
  const { i18n, t } = useTranslation();
  const { clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const logout = async () => {
    try {
      await clearAuth();
      successToast(t("common.logoutSuccess"));
    } catch (e) {
      errorToast(t("common.logoutError"));
    }
  };

  return (
    <div className="relative" ref={ref}>
      <img
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full object-contain"
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        alt="user-avatar"
      />
      {isOpen && (
        <div
          className={`absolute mt-2 bg-white border border-slate-200 shadow-lg rounded-sm p-2 ${
            i18n.language === "en" ? "right-0 left-auto" : "left-0 right-auto"
          }`}
        >
          <button
            onClick={() => logout()}
            className="px-6 py-1 text-sm rounded-sm bg-red-400 text-white hover:opacity-75 text-nowrap"
          >
            {t("common.logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
