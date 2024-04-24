import { useParams } from "next/navigation"

import { FC, Fragment } from "react"

import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import useSWR from "swr"

import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { TimeLogTable, TimesheetAppliedFilters, TimesheetViewTabs } from "@components/time-tracker"
import { SpreadsheetLayoutLoader } from "@components/ui"

import {
    useApplication,
    useEventTracker,
    useProject,
    useTimeTracker,
    useTimeTrackerFilter,
    useUser,
} from "@hooks/store"

import { ERoles } from "@constants/iam"

import { ITimesheetDisplayFilterOptions, ITimesheetDisplayPropertyOptions } from "@servcy/types"

export const TimeSheetRoot: FC = observer(() => {
    const { workspaceSlug, viewKey } = useParams()
    const { resolvedTheme } = useTheme()
    const { commandPalette: commandPaletteStore } = useApplication()
    const { filters, fetchFilters } = useTimeTrackerFilter()
    const { fetchTimeSheet, timesheet, loader } = useTimeTracker()
    const {
        membership: { currentWorkspaceRole },
        currentUser,
    } = useUser()
    const { workspaceProjectIds } = useProject()
    const { setTrackElement } = useEventTracker()
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const emptyStateImage = getEmptyStateImagePath("all-issues", "assigned", isLightMode)
    const displayFilters = filters[viewKey.toString()]?.displayFilters as ITimesheetDisplayFilterOptions
    const displayProperties = filters[viewKey.toString()]?.displayProperties as ITimesheetDisplayPropertyOptions
    useSWR(
        workspaceSlug && viewKey ? `TIMESHEET_ENTRIES_${workspaceSlug}_${viewKey}` : null,
        async () => {
            if (workspaceSlug && viewKey) {
                await fetchFilters(workspaceSlug.toString(), viewKey.toString())
                await fetchTimeSheet(
                    workspaceSlug.toString(),
                    viewKey.toString(),
                    filters[viewKey.toString()]?.filters,
                    "init-loader"
                )
            }
        },
        { revalidateIfStale: false, revalidateOnFocus: false }
    )
    const isEditingAllowed = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.MEMBER
    if (loader === "init-loader" || !viewKey || !timesheet) return <SpreadsheetLayoutLoader />
    return (
        <>
            <TimesheetViewTabs />
            <div className="relative flex h-full w-full flex-col overflow-hidden">
                <div className="relative h-full w-full flex flex-col">
                    <TimesheetAppliedFilters viewKey={viewKey.toString()} />
                    {timesheet.length === 0 ? (
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
                        <Fragment>
                            <TimeLogTable displayFilters={displayFilters} displayProperties={displayProperties} />
                        </Fragment>
                    )}
                </div>
            </div>
        </>
    )
})
