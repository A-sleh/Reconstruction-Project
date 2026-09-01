import i18n from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ClipboardList,
  FileText,
  HardHat,
  LayoutDashboard,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Settings,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

export interface ProjectSectionItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface ProjectSideBarProps {
  activeKey: string;
  onChange: (key: string) => void;
  children?: ReactNode;
}

const sections: ProjectSectionItem[] = [
  {
    key: "statistics",
    label: i18n.t("project.details.sections.statistics"),
    icon: BarChart3,
  },
  {
    key: "overview",
    label: i18n.t("project.details.sections.overview"),
    icon: ClipboardList,
  },
  {
    key: "work shop",
    label: i18n.t("project.details.sections.workShop"),
    icon: Wrench,
  },
  {
    key: "board",
    label: i18n.t("project.details.sections.board"),
    icon: LayoutDashboard,
  },
  {
    key: "messages",
    label: i18n.t("project.details.sections.messages"),
    icon: MessagesSquare,
  },
  {
    key: "manage resources",
    label: i18n.t("project.details.sections.manageResources"),
    icon: Truck,
  },
  {
    key: "manage services",
    label: i18n.t("project.details.sections.manageServices"),
    icon: HardHat,
  },
  {
    key: "manage engineers",
    label: i18n.t("project.details.sections.manageEngineers"),
    icon: Users,
  },
  {
    key: "invoices",
    label: i18n.t("project.details.sections.invoices"),
    icon: Receipt,
  },
  {
    key: "reports",
    label: i18n.t("project.details.sections.reports"),
    icon: FileText,
  },
  {
    key: "settings",
    label: i18n.t("project.details.sections.settings"),
    icon: Settings,
  },
];

const ProjectSideBar = ({
  activeKey,
  onChange,
  children,
}: ProjectSideBarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col rounded-lg border border-gray-300 bg-white shadow-card transition-[width] duration-300 ease-out overflow-hidden sticky top-25 self-start",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className={cn("flex flex-col", collapsed ? "w-16" : "w-64")}>
        <div
          className={cn(
            "flex items border-b border-gray-200 px-3 py-2.5",
            collapsed ? "justify-center" : "justify-end",
          )}
        >
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <ul className="flex flex-col gap-1 p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.key === activeKey;
            return (
              <li key={section.key}>
                <button
                  type="button"
                  onClick={() => onChange(section.key)}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? section.label : undefined}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive && "scale-110",
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{section.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {children && !collapsed && (
          <div className="border-t border-gray-200 p-3">{children}</div>
        )}
      </div>
    </aside>
  );
};

export default ProjectSideBar;
