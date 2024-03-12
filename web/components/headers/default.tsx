import { BreadcrumbLink } from "@components/common"
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"

import { Breadcrumbs } from "@servcy/ui"

export const DefaultHeader = ({ title, icon }: { title: string; icon?: React.ReactNode }) => (
    <>
        <div className="relative z-[15] flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
            <div className="flex items-center gap-2 overflow-ellipsis whitespace-nowrap">
                <SidebarHamburgerToggle />
                <div>
                    <Breadcrumbs>
                        <Breadcrumbs.BreadcrumbItem type="text" link={<BreadcrumbLink label={title} icon={icon} />} />
                    </Breadcrumbs>
                </div>
            </div>
        </div>
    </>
)
