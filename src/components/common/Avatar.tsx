import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { paths } from "@/config/paths";
import { getDominImageURL } from "@/lib/helpers";
import useAuthStore, { clearTokens } from "@/stores/useAuthStore";

import { errorToast, successToast } from "./Toast";

const Avatar = () => {
  const goto = useNavigate();
  const { i18n, t } = useTranslation();
  const { clearAuth, user } = useAuthStore();
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
      await clearTokens();
      successToast(t("common.logoutSuccess"));
      goto(paths.auth.login.getHref(), { replace: true });
    } catch (e) {
      errorToast(t("common.logoutError"));
    }
  };

  return (
    <div className="relative" ref={ref}>
      <img
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full object-contain "
        src={getDominImageURL(user?.photoURL ?? "")}
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
