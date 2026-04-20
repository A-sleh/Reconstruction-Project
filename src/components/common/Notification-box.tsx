import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosNotificationsOutline } from "react-icons/io";

const NotificationBox = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ message: string }[]>([]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((last) => !last)}
        className="hover:rotate-45 transition cursor-pointer"
      >
        <span className="rounded-full h-1.5 w-1.5 bg-red-400 absolute top-1 left-1 cursor-pointer"></span>
        <IoIosNotificationsOutline size={26} />
      </button>
      {isOpen && (
        <div
          className={`absolute mt-2 w-80 bg-white border border-slate-200 shadow-lg rounded-lg ${
            i18n.language == "ar" ? "right-0 left-auto" : "left-0 right-auto"
          }`}
        >
          {notifications.length == 0 ? (
            <p className="p-4 text-sm font-medium text-red-400">
              {t("home.no-notifications-messages")}
            </p>
          ) : (
            notifications.map((notification) => (
              <div className="p-4 border-b border-slate-200">
                {notification.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBox;
