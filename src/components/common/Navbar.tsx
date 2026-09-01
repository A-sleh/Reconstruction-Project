import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { FiBarChart2 } from "react-icons/fi";
import { MdOutlineConstruction } from "react-icons/md";
import {
  RiBuilding2Line,
  RiBuilding4Line,
  RiBarChartBoxLine,
  RiCustomerService2Line,
  RiFolderShieldLine,
  RiFoldersLine,
  RiHome9Line,
  RiListUnordered,
  RiShoppingBagLine,
  RiStore2Line,
  RiUserSettingsLine,
  RiUserStarLine,
} from "react-icons/ri";

import { paths } from "@/config/paths";
import { useCan } from "@/hooks/useCan";
import type { Permission } from "@/lib/permissions";
import { Permissions } from "@/lib/permissions";
import useAuthStore from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";
import NotificationBox from "./Notification-box";
import ToggleLanguage from "./Toggle-language";

const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const can = useCan();

  const user = useAuthStore((s) => s.user);
  const isResourceProvidor = user?.providerRole == "Resource";
  const isEngineer = user?.role == "Engineer";

  const profileHref = isEngineer
    ? paths.app.engineer.profile.path
    : isResourceProvidor
      ? paths.app.resourceProvidor.profile.path
      : paths.app.serviceProvidor.profile.path;

  const links: Array<{
    label: string;
    href: string;
    icon: ReactNode;
    permission: Permission;
  }> = [
    {
      label: t("navbar.workSites"),
      href: isResourceProvidor
        ? paths.app.resourceProvidor.workSites.path
        : paths.app.serviceProvidor.workSites.path,
      icon: <MdOutlineConstruction size={18} />,
      permission: Permissions.WORK_SITES_VIEW,
    },
    {
      label: t("navbar.profile"),
      href: profileHref,
      icon: <CgProfile size={18} />,
      permission: Permissions.PROFILE_VIEW,
    },
    {
      label: t("navbar.statistics"),
      href: isResourceProvidor
        ? paths.app.resourceProvidor.statistics.path
        : paths.app.serviceProvidor.statistics.path,
      icon: <FiBarChart2 size={18} />,
      permission: Permissions.STATISTICS_VIEW,
    },
    {
      label: t("navbar.orders"),
      href: isResourceProvidor
        ? paths.app.resourceProvidor.orders.path
        : paths.app.serviceProvidor.orders.path,
      icon: <RiShoppingBagLine size={18} />,
      permission: Permissions.ORDERS_VIEW,
    },
    {
      label: t("navbar.hisLands"),
      href: paths.app.investor.hisLandsAndBuildings.path,
      icon: <RiBuilding2Line size={18} />,
      permission: Permissions.LANDS_VIEW,
    },
    {
      label: t("navbar.market"),
      href: paths.app.investor.marketOfLandsBuildings.path,
      icon: <RiStore2Line size={18} />,
      permission: Permissions.MARKETPLACE_VIEW,
    },
    {
      label: t("navbar.listProperty"),
      href: paths.app.investor.propertyVerfication.path,
      icon: <RiListUnordered size={18} />,
      permission: Permissions.PROPERTY_LIST,
    },
    {
      label: t("navbar.manage-users"),
      href: paths.app.admin.manageUsers.path,
      icon: <RiUserSettingsLine size={18} />,
      permission: Permissions.USERS_MANAGE,
    },
    {
      label: t("navbar.manage-system-bank"),
      href: paths.app.admin.categories.path,
      icon: <RiFoldersLine size={18} />,
      permission: Permissions.CATEGORIES_MANAGE,
    },
    {
      label: t("navbar.verify-engineers"),
      href: paths.app.admin.engineerVerification.path,
      icon: <RiUserStarLine size={18} />,
      permission: Permissions.ENGINEERS_VERIFY,
    },
    {
      label: t("navbar.verify-buildings"),
      href: paths.app.admin.buildingVerification.path,
      icon: <RiBuilding4Line size={18} />,
      permission: Permissions.BUILDINGS_VERIFY,
    },
    {
      label: t("navbar.support"),
      href: paths.app.admin.support.path,
      icon: <RiCustomerService2Line size={18} />,
      permission: Permissions.SUPPORT_MANAGE,
    },
    {
      label: t("navbar.statistics"),
      href: paths.app.admin.statistics.path,
      icon: <RiBarChartBoxLine size={18} />,
      permission: Permissions.STATISTICS_VIEW,
    },
    {
      label: t("navbar.support-center"),
      href: paths.app.support.path,
      icon: <RiCustomerService2Line size={18} />,
      permission: Permissions.SUPPORT_VIEW,
    },
    {
      label: t("navbar.projects"),
      href: paths.app.projects.path,
      icon: <RiFolderShieldLine size={18} />,
      permission: Permissions.PROJECTS_VIEW,
    },
  ];

  const sharedLink: Array<{ label: string; href: string; icon: ReactNode }> = [
    {
      label: t("navbar.home"),
      href: paths.app.home.path,
      icon: <RiHome9Line size={18} />,
    },
  ];

  const filteredLinks = links.filter((link) => can(link.permission));

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
