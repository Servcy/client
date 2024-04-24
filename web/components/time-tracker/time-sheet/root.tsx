import { useParams, useSearchParams } from "next/navigation"

import React, { Fragment } from "react"

import isEmpty from "lodash/isEmpty"
import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import useSWR from "swr"

import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { GlobalViewsAppliedFiltersRoot } from "@components/issues"
import { SpreadsheetLayoutLoader } from "@components/ui"

import {
    useApplication,
    useEventTracker,
    useIssues,
    useProject,
    useTimeTracker,
    useTimeTrackerFilter,
    useUser,
} from "@hooks/store"
import { useWorkspaceIssueProperties } from "@hooks/use-workspace-issue-properties"

import { ERoles } from "@constants/iam"
import { EIssuesStoreType, ISSUE_DISPLAY_FILTERS_BY_LAYOUT } from "@constants/issue"

export const TimeSheetRoot: React.FC = observer(() => {
    const searchParams = useSearchParams()
    const { workspaceSlug, viewKey } = useParams()
    // theme
    const { resolvedTheme } = useTheme()
    //swr hook for fetching issue properties
    useWorkspaceIssueProperties(workspaceSlug)
    // store
    const { commandPalette: commandPaletteStore } = useApplication()
    const {
        issues: { loader, groupedIssueIds },
    } = useIssues(EIssuesStoreType.GLOBAL)
    const { filters, fetchFilters, updateFilters } = useTimeTrackerFilter()
    const { fetchTimeSheet } = useTimeTracker()

    const { dataViewId, issueIds } = groupedIssueIds
    const {
        membership: { currentWorkspaceRole },
        currentUser,
    } = useUser()
    const { workspaceProjectIds } = useProject()
    const { setTrackElement } = useEventTracker()
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const emptyStateImage = getEmptyStateImagePath("all-issues", "assigned", isLightMode)

    const routerFilterParams = () => {
        // filter init from the query params
        if (
            workspaceSlug &&
            viewKey &&
            ["all-issues", "assigned", "created", "subscribed"].includes(viewKey.toString())
        ) {
            const routerQueryParams = Object.fromEntries(searchParams)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ["workspaceSlug"]: _workspaceSlug, ["viewId"]: _globalViewId, ...filters } = routerQueryParams

            let timesheetFilters: any = {}
            Object.keys(filters).forEach((key) => {
                const filterKey: any = key
                const filterValue = filters[key]?.toString() || undefined
                if (
                    ISSUE_DISPLAY_FILTERS_BY_LAYOUT["my_issues"]?.["spreadsheet"]?.filters.includes(filterKey) &&
                    filterKey &&
                    filterValue
                )
                    timesheetFilters = { ...timesheetFilters, [filterKey]: filterValue.split(",") }
            })

            if (!isEmpty(filters)) updateFilters(workspaceSlug.toString(), timesheetFilters, viewKey.toString())
        }
    }

    useSWR(
        workspaceSlug && viewKey ? `TIMESHEET_ENTRIES_${workspaceSlug}_${viewKey}` : null,
        async () => {
            if (workspaceSlug && viewKey) {
                await fetchFilters(workspaceSlug.toString(), viewKey.toString())
                await fetchTimeSheet(workspaceSlug.toString(), viewKey.toString(), filters)
                routerFilterParams()
            }
        },
        { revalidateIfStale: false, revalidateOnFocus: false }
    )

    const isEditingAllowed = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.MEMBER

    if (loader === "init-loader" || !viewKey || viewKey !== dataViewId || !issueIds) {
        return <SpreadsheetLayoutLoader />
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden">
            <div className="relative h-full w-full flex flex-col">
                <GlobalViewsAppliedFiltersRoot globalViewId={viewKey.toString()} />
                {issueIds.length === 0 ? (
                    <EmptyState
                        image={emptyStateImage}
                        title={(workspaceProjectIds ?? []).length > 0 ? "No time logs yet" : "No project"}
                        description={
                            (workspaceProjectIds ?? []).length > 0
                                ? "To view your time logs, you need to track time for issues first."
                                : "To track time for issues, you need to create a project or be a part of one."
                        }
                        size="sm"
                        primaryButton={
                            (workspaceProjectIds ?? []).length > 0
                                ? {
                                      text: "Start Timer",
                                      onClick: () => {
                                          setTrackElement("Timesheet empty state")
                                          commandPaletteStore.toggleTimeTrackerModal(true)
                                      },
                                  }
                                : {
                                      text: "Start your first project",
                                      onClick: () => {
                                          setTrackElement("All issues empty state")
                                          commandPaletteStore.toggleCreateProjectModal(true)
                                      },
                                  }
                        }
                        disabled={!isEditingAllowed}
                    />
                ) : (
                    <Fragment />
                )}
            </div>
        </div>
    )
})
