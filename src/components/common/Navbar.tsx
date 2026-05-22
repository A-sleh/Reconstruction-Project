import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";

import { RiHome9Line } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDesignServices } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";

import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { paths } from "@/config/paths";
import NotificationBox from "./Notification-box";
import ToggleLanguage from "./Toggle-language";

type UserRole = "resourceProvidor" | "investor" | "engineer";

interface NavbarProps {
  userRole: UserRole;
  userName?: string;
  language?: "en" | "ar";
  onLanguageChange?: () => void;
}

const roleLinks: Record<
  UserRole,
  Array<{ label: string; href: string; icon: ReactNode }>
> = {
  resourceProvidor: [
    {
      label: "site resource",
      href: paths.app.resourceProvidor.workSite.path,
      icon: <CgProfile size={18} />,
    },
    {
      label: "work Sites",
      href: paths.app.resourceProvidor.workSites.path,
      icon: <MdOutlineDesignServices size={18} />,
    }
  ],
  investor: [
    { label: "Dashboard", href: "/app/investor/dashboard" },
    { label: "Investments", href: "/app/investor/investments" },
    { label: "Profile", href: "/app/investor/profile" },
  ],
  engineer: [
    { label: "Dashboard", href: "/app/engineer/dashboard" },
    { label: "Tasks", href: "/app/engineer/tasks" },
    { label: "Profile", href: "/app/engineer/profile" },
  ],
};

const sharedLink: Array<{ label: string; href: string; icon: ReactNode }> = [
  {
    label: "Home",
    href: paths.app.home.path,
    icon: <RiHome9Line size={18} />,
  },
];

const roleTitles: Record<UserRole, string> = {
  resourceProvidor: "Resource Provider",
  investor: "Investor",
  engineer: "Engineer",
};

const Navbar = ({
  userRole,
  userName = "User",
  language = "en",
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = roleLinks[userRole] ?? roleLinks.resourceProvidor;

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex gap-4 px-8 py-3 flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full object-contain"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="user-avatar"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">{roleTitles[userRole]}</p>
          </div>
          <span className="mx-10">
            <NotificationBox />
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ToggleLanguage />

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <AiOutlineClose className="h-6 w-6" />
            ) : (
              <AiOutlineMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <nav
        className={`mx-auto  border-t border-slate-100 px-4 md:bg-primary md:text-white  justify-center md:flex md:flex-wrap md:items-center md:gap-3 md:border-t-0 shadow-md ${
          menuOpen ? "flex flex-col gap-3" : "hidden"
        }`}
      >
        {[...links, ...sharedLink].map((link) => (
          <NavLink
            end={true}
            key={link.label}
            to={link.href}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-4 text-sm font-medium transition hover:text-primary hover:bg-white  md:inline-flex ${isActive && " text-primary bg-white"} flex justify-center items-center gap-2 `
            }
          >
            {link.label}
            {link.icon}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
