import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdNotifications, MdLanguage } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { paths } from "@/config/paths";

type UserRole = "resourceProvidor" | "investor" | "engineer";

interface NavbarProps {
  userRole: UserRole;
  userName?: string;
  language?: "en" | "ar";
  onLanguageChange?: () => void;
}

const roleLinks: Record<UserRole, Array<{ label: string; href: string }>> = {
  resourceProvidor: [
      { label: "Profile", href: paths.app.resourceProvidor.progile.path },
    { label: "Services", href: paths.app.resourceProvidor.services.path },
    { label: "Orders", href: paths.app.resourceProvidor.orders.path },
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

const roleTitles: Record<UserRole, string> = {
  resourceProvidor: "Resource Provider",
  investor: "Investor",
  engineer: "Engineer",
};

const Navbar = ({
  userRole,
  userName = "User",
  language = "en",
  onLanguageChange,
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = roleLinks[userRole] ?? roleLinks.resourceProvidor;

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-300  gap-4 px-4 py-3 flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 shadow-sm">
            <FaUserCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">{roleTitles[userRole]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onLanguageChange}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            <MdLanguage className="h-5 w-5" />
            {language === "en" ? "EN" : "AR"}
          </button>

          {/* <button
            type="button"
            className="relative inline-flex items-center gap-2 rounded-2xl bg-slate-900  p-2 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <MdNotifications className="h-5 w-5" />
          </button> */}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <AiOutlineClose className="h-6 w-6" /> : <AiOutlineMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <nav
        className={`mx-auto  border-t border-slate-100 px-4 md:bg-black md:text-white  justify-center md:flex md:flex-wrap md:items-center md:gap-3 md:border-t-0 shadow-md ${
          menuOpen ? "flex flex-col gap-3" : "hidden"
        }`}
      >
        {links.map((link) => (
          <NavLink
            end={true}
            key={link.label}
            to={link.href}
            onClick={() => setMenuOpen(false)}
            className={({isActive}) => `px-4 py-4 text-sm font-medium transition hover:text-primary hover:bg-white  md:inline-flex ${isActive&&" text-primary bg-white"}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
