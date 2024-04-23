import { useParams } from "next/navigation"

import { useCallback } from "react"

import { CalendarClock, FolderClock } from "lucide-react"
import { observer } from "mobx-react-lite"

import { BreadcrumbLink } from "@components/common"
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"
import { FiltersDropdown, FilterSelection } from "@components/issues"

import { useIssues, useLabel, useMember } from "@hooks/store"

import { EIssueFilterType, EIssuesStoreType, ISSUE_DISPLAY_FILTERS_BY_LAYOUT } from "@constants/time-tracker"

import { IIssueFilterOptions } from "@servcy/types"
import { Breadcrumbs } from "@servcy/ui"

type Props = {
    activeLayout: "my-timesheet" | "workspace-timesheet"
}

export const TimesheetHeader: React.FC<Props> = observer((props) => {
    const { activeLayout } = props
    const { workspaceSlug, globalViewId } = useParams()
    const {
        issuesFilter: { filters, updateFilters },
    } = useIssues(EIssuesStoreType.GLOBAL)
    const { workspaceLabels } = useLabel()
    const {
        workspace: { workspaceMemberIds },
    } = useMember()
    const issueFilters = globalViewId ? filters[globalViewId.toString()] : undefined
    const handleFiltersUpdate = useCallback(
        (key: keyof IIssueFilterOptions, value: string | string[]) => {
            if (!workspaceSlug || !globalViewId) return
            const newValues = issueFilters?.filters?.[key] ?? []

            if (Array.isArray(value)) {
                value.forEach((val) => {
                    if (!newValues.includes(val)) newValues.push(val)
                })
            } else {
                if (issueFilters?.filters?.[key]?.includes(value)) newValues.splice(newValues.indexOf(value), 1)
                else newValues.push(value)
            }

            updateFilters(
                workspaceSlug.toString(),
                undefined,
                EIssueFilterType.FILTERS,
                { [key]: newValues },
                globalViewId.toString()
            )
        },
        [workspaceSlug, issueFilters, updateFilters, globalViewId]
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
                        <FilterSelection
                            layoutDisplayFiltersOptions={ISSUE_DISPLAY_FILTERS_BY_LAYOUT.my_issues.spreadsheet}
                            filters={issueFilters?.filters ?? {}}
                            handleFiltersUpdate={handleFiltersUpdate}
                            labels={workspaceLabels ?? undefined}
                            memberIds={workspaceMemberIds ?? undefined}
                        />
                    </FiltersDropdown>
                </div>
            </div>
        </>
    )
})
