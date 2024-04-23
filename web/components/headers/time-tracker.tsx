import { useParams } from "next/navigation"

import { useCallback } from "react"

import { CalendarClock, FolderClock } from "lucide-react"
import { observer } from "mobx-react-lite"

import { BreadcrumbLink } from "@components/common"
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"
import { FiltersDropdown } from "@components/issues"
import { ITimesheetFilters, TimesheetFilterSelection } from "@components/time-tracker"

import { useMember, useTimeTrackerFilter } from "@hooks/store"

import { Breadcrumbs } from "@servcy/ui"

export const TimesheetHeader: React.FC<{
    activeLayout: "my-timesheet" | "workspace-timesheet"
}> = observer(({ activeLayout }) => {
    const { workspaceSlug, viewKey } = useParams()
    const { filters, updateFilters } = useTimeTrackerFilter()
    const {
        workspace: { workspaceMemberIds },
    } = useMember()
    const handleFiltersUpdate = useCallback(
        (key: keyof ITimesheetFilters, value: string | string[]) => {
            if (!workspaceSlug || !viewKey) return
            const newValues = filters?.[key] ?? []
            if (Array.isArray(value)) {
                value.forEach((val) => {
                    if (!newValues.includes(val)) newValues.push(val)
                })
            } else {
                if (filters?.[key]?.includes(value)) newValues.splice(newValues.indexOf(value), 1)
                else newValues.push(value)
            }
            updateFilters(workspaceSlug.toString(), { [key]: newValues }, viewKey.toString())
        },
        [workspaceSlug, filters, updateFilters, viewKey]
    )

    return (
        <>
            <div className="relative z-[15] flex h-[3.75rem] w-full items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
                <div className="relative flex gap-2">
                    <SidebarHamburgerToggle />
                    <Breadcrumbs>
                        <Breadcrumbs.BreadcrumbItem
                            type="text"
                            link={
                                <BreadcrumbLink
                                    label={activeLayout === "my-timesheet" ? "My Timesheet" : "Workspace Timesheet"}
                                    icon={
                                        activeLayout === "my-timesheet" ? (
                                            <CalendarClock className="size-4 text-custom-text-300" />
                                        ) : (
                                            <FolderClock className="size-4 text-custom-text-300" />
                                        )
                                    }
                                />
                            }
                        />
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <FiltersDropdown title="Filters" placement="bottom-end">
                        <TimesheetFilterSelection
                            filters={filters ?? {}}
                            handleFiltersUpdate={handleFiltersUpdate}
                            memberIds={workspaceMemberIds ?? undefined}
                        />
                    </FiltersDropdown>
                </div>
            </div>
        </>
    )
})
