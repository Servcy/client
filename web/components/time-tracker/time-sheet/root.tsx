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

import { ALL_ISSUES_EMPTY_STATE_DETAILS } from "@constants/empty-state"
import { ERoles } from "@constants/iam"
import { EIssuesStoreType, ISSUE_DISPLAY_FILTERS_BY_LAYOUT } from "@constants/issue"

export const TimeSheetRoot: React.FC = observer(() => {
    const params = useParams()
    const searchParams = useSearchParams()
    const { workspaceSlug, viewId } = params
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

    const isDefaultView = ["all-issues", "assigned", "created", "subscribed"].includes(groupedIssueIds.dataViewId)
    const currentView = isDefaultView ? groupedIssueIds.dataViewId : "custom-view"
    const currentViewDetails =
        ALL_ISSUES_EMPTY_STATE_DETAILS[currentView as keyof typeof ALL_ISSUES_EMPTY_STATE_DETAILS]

    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const emptyStateImage = getEmptyStateImagePath("all-issues", currentView, isLightMode)

    const routerFilterParams = () => {
        // filter init from the query params
        if (
            workspaceSlug &&
            viewId &&
            ["all-issues", "assigned", "created", "subscribed"].includes(viewId.toString())
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

            if (!isEmpty(filters)) updateFilters(workspaceSlug.toString(), timesheetFilters, viewId.toString())
        }
    }

    useSWR(
        workspaceSlug && viewId ? `TIMESHEET_ENTRIES_${workspaceSlug}_${viewId}` : null,
        async () => {
            if (workspaceSlug && viewId) {
                await fetchFilters(workspaceSlug.toString(), viewId.toString())
                await fetchTimeSheet(workspaceSlug.toString(), viewId.toString(), filters)
                routerFilterParams()
            }
        },
        { revalidateIfStale: false, revalidateOnFocus: false }
    )

    const isEditingAllowed = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.MEMBER

    if (loader === "init-loader" || !viewId || viewId !== dataViewId || !issueIds) {
        return <SpreadsheetLayoutLoader />
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden">
            <div className="relative h-full w-full flex flex-col">
                <GlobalViewsAppliedFiltersRoot globalViewId={viewId.toString()} />
                {issueIds.length === 0 ? (
                    <EmptyState
                        image={emptyStateImage}
                        title={(workspaceProjectIds ?? []).length > 0 ? currentViewDetails.title : "No project"}
                        description={
                            (workspaceProjectIds ?? []).length > 0
                                ? currentViewDetails.description
                                : "To create issues or manage your work, you need to create a project or be a part of one."
                        }
                        size="sm"
                        primaryButton={
                            (workspaceProjectIds ?? []).length > 0
                                ? currentView !== "custom-view" && currentView !== "subscribed"
                                    ? {
                                          text: "Create new issue",
                                          onClick: () => {
                                              setTrackElement("All issues empty state")
                                              commandPaletteStore.toggleCreateIssueModal(true, EIssuesStoreType.PROJECT)
                                          },
                                      }
                                    : undefined
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
