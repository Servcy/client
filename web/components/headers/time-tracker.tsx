import { useParams } from "next/navigation"

import { useCallback } from "react"

import { CalendarClock, FolderClock, Timer } from "lucide-react"
import { observer } from "mobx-react-lite"

import { BreadcrumbLink } from "@components/common"
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"
import { FiltersDropdown } from "@components/issues"
import { TimesheetDisplayFiltersSelection, TimesheetFilterSelection } from "@components/time-tracker"

import { useApplication, useMember, useTimeTracker, useTimeTrackerFilter } from "@hooks/store"

import { ETimesheetFilterType } from "@constants/timesheet"

import {
    ITimesheetDisplayFilterOptions,
    ITimesheetDisplayPropertyOptions,
    ITimesheetFilterOptions,
} from "@servcy/types"
import { Breadcrumbs, Button } from "@servcy/ui"

export const TimesheetHeader: React.FC<{
    activeLayout: "my-timesheet" | "workspace-timesheet"
}> = observer(({ activeLayout }) => {
    const { workspaceSlug } = useParams()
    const { filters, updateFilters } = useTimeTrackerFilter()
    const { runningTimeTracker } = useTimeTracker()
    const {
        commandPalette: { toggleTimeTrackerModal },
    } = useApplication()
    const {
        workspace: { workspaceMemberIds },
    } = useMember()

    const handleDisplayProperties = useCallback(
        (property: Partial<ITimesheetDisplayPropertyOptions>) => {
            if (!workspaceSlug || !activeLayout) return
            updateFilters(
                workspaceSlug.toString(),
                ETimesheetFilterType.DISPLAY_PROPERTIES,
                property,
                activeLayout.toString()
            )
        },
        [workspaceSlug, updateFilters, activeLayout]
    )
    const handleDisplayFilters = useCallback(
        (updatedDisplayFilter: Partial<ITimesheetDisplayFilterOptions>) => {
            if (!workspaceSlug || !activeLayout) return
            updateFilters(
                workspaceSlug.toString(),
                ETimesheetFilterType.DISPLAY_FILTERS,
                updatedDisplayFilter,
                activeLayout.toString()
            )
        },
        [workspaceSlug, updateFilters, activeLayout]
    )
    const handleFiltersUpdate = useCallback(
        (key: keyof ITimesheetFilterOptions, value: string | string[]) => {
            if (!workspaceSlug || !activeLayout) return
            const newValues = filters[activeLayout]?.filters?.[key] ?? []
            if (Array.isArray(value)) {
                value.forEach((val) => {
                    if (!newValues.includes(val)) newValues.push(val)
                })
            } else {
                if (filters[activeLayout]?.filters?.[key]?.includes(value))
                    newValues.splice(newValues.indexOf(value), 1)
                else newValues.push(value)
            }
            updateFilters(
                workspaceSlug.toString(),
                ETimesheetFilterType.FILTERS,
                { [key]: newValues },
                activeLayout.toString()
            )
        },
        [workspaceSlug, filters, updateFilters, activeLayout]
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
                            filters={filters?.[activeLayout.toString()]?.filters ?? {}}
                            handleFiltersUpdate={handleFiltersUpdate}
                            activeLayout={activeLayout}
                            memberIds={workspaceMemberIds ?? undefined}
                        />
                    </FiltersDropdown>
                    <FiltersDropdown title="Display" placement="bottom-end">
                        <TimesheetDisplayFiltersSelection
                            displayFilters={filters?.[activeLayout.toString()]?.displayFilters ?? {}}
                            displayProperties={filters?.[activeLayout.toString()]?.displayProperties ?? {}}
                            handleDisplayFiltersUpdate={handleDisplayFilters}
                            handleDisplayPropertiesUpdate={handleDisplayProperties}
                        />
                    </FiltersDropdown>
                    <Button
                        variant="primary"
                        size="sm"
                        prependIcon={<Timer />}
                        onClick={() => toggleTimeTrackerModal(true)}
                    >
                        {!runningTimeTracker ? "Start Timer" : "Stop Timer"}
                    </Button>
                </div>
            </div>
        </>
    )
})
