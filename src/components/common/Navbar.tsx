import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  RiHome9Line,
  RiShoppingBagLine,
  RiBuilding2Line,
  RiStore2Line,
  RiListUnordered,
} from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import {
  MdOutlineConstruction,
  MdOutlineVerified,
  MdDomain,
} from "react-icons/md";
import { FiBarChart2 } from "react-icons/fi";

import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { paths } from "@/config/paths";
import NotificationBox from "./Notification-box";
import ToggleLanguage from "./Toggle-language";
import { useTranslation } from "react-i18next";
import Avatar from "./Avatar";
import { ROLE, useAuthStore } from "@/stores/useAuthStore";

const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = useAuthStore((s) => s.role);

  const links: Array<{
    label: string;
    href: string;
    icon: ReactNode;
    role: ROLE[];
  }> = [
    {
      label: t("navbar.workSites"),
      href: paths.app.resourceProvidor.workSites.path,
      icon: <MdOutlineConstruction size={18} />,
      role: ["Provider"],
    },
    {
      label: t("navbar.profile"),
      href: paths.app.resourceProvidor.profile.path,
      icon: <CgProfile size={18} />,
      role: ["Provider"],
    },
    {
      label: t("navbar.statistics"),
      href: paths.app.resourceProvidor.statistics.path,
      icon: <FiBarChart2 size={18} />,
      role: ["Provider"],
    },
    {
      label: t("navbar.orders"),
      href: paths.app.resourceProvidor.orders.path,
      icon: <RiShoppingBagLine size={18} />,
      role: ["Provider"],
    },
    {
      label: t("navbar.hisLands"),
      href: paths.app.investor.hisLandsAndBuildings.path,
      icon: <RiBuilding2Line size={18} />,
      role: ["Investor"],
    },
    {
      label: t("navbar.market"),
      href: paths.app.investor.marketOfLandsBuildings.path,
      icon: <RiStore2Line size={18} />,
      role: ["Investor"],
    },
    {
      label: t("navbar.listProperty"),
      href: paths.app.investor.propertyVerfication.path,
      icon: <RiListUnordered size={18} />,
      role: ["Investor"],
    }
  ];

  const sharedLink: Array<{ label: string; href: string; icon: ReactNode }> = [
    {
      label: t("navbar.home"),
      href: paths.app.home.path,
      icon: <RiHome9Line size={18} />,
    },
  ];

  const filteredLinks = role ? links.filter((link) => link.role.includes(role)) : [];

  return (
    <header className="bg-white shadow-sm w-[95%] md:w-[98%] mx-auto rounded-lg sticky top-4 z-50">
      <div className="mx-auto flex gap-4 px-3 md:px-8 py-3 items-center justify-between flex-row-reverse">
        <div className="flex items-end flex-row-reverse gap-3">
          <Avatar />
          <span className="mx-2 flex items-end gap-1">
            <NotificationBox />
          </span>
        </div>

        <div className="flex items-center  gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <AiOutlineClose className="h-6 w-6" />
            ) : (
              <AiOutlineMenu className="h-6 w-6" />
            )}
          </button>
          <ToggleLanguage />
          <nav className="hidden mx-auto justify-center md:flex md:flex-wrap md:items-center md:gap-3">
            {[...sharedLink, ...filteredLinks].map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2 px-4 text-sm font-medium transition hover:bg-primary/50 hover:text-white rounded-lg  md:inline-flex ${isActive && " bg-primary text-white"} flex justify-center items-center gap-2 `
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      {menuOpen && (
        <nav className="flex md:hidden mx-auto justify-center flex-col gap-2 md:items-center md:gap-3">
          {[...filteredLinks, ...sharedLink].map((link) => (
            <NavLink
              end={true}
              key={link.label}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `p-4 mx-2 text-sm font-medium transition hover:bg-primary/50 hover:text-white rounded-lg  md:inline-flex ${isActive && " bg-primary text-white"} flex justify-center items-center gap-2 `
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
