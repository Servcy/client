import { LayoutGrid, Zap } from "lucide-react";
// components
import { BreadcrumbLink } from "@components/common";
import { Breadcrumbs } from "@servcy/ui";
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle";

export const WorkspaceDashboardHeader = () => (
  <>
    <div className="relative z-[15] flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
      <div className="flex items-center gap-2 overflow-ellipsis whitespace-nowrap">
        <SidebarHamburgerToggle />
        <div>
          <Breadcrumbs>
            <Breadcrumbs.BreadcrumbItem
              type="text"
              link={<BreadcrumbLink label="Dashboard" icon={<LayoutGrid className="h-4 w-4 text-custom-text-300" />} />}
            />
          </Breadcrumbs>
        </div>
      </div>
    </div>
  </>
);
