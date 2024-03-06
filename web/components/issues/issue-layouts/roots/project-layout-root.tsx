import { useRouter } from "next/router"

import { FC, Fragment } from "react"

import { observer } from "mobx-react-lite"
import useSWR from "swr"

import {
    CalendarLayout,
    GanttLayout,
    IssuePeekOverview,
    KanBanLayout,
    ListLayout,
    ProjectAppliedFiltersRoot,
    ProjectEmptyState,
    ProjectSpreadsheetLayout,
} from "@components/issues"
import { ActiveLoader } from "@components/ui"

import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { Spinner } from "@servcy/ui"

export const ProjectLayoutRoot: FC = observer(() => {
    // router
    const router = useRouter()
    const { workspaceSlug, projectId } = router.query

    const { issues, issuesFilter } = useIssues(EIssuesStoreType.PROJECT)

    useSWR(
        workspaceSlug && projectId ? `PROJECT_ISSUES_${workspaceSlug}_${projectId}` : null,
        async () => {
            if (workspaceSlug && projectId) {
                await issuesFilter?.fetchFilters(workspaceSlug.toString(), projectId.toString())
                await issues?.fetchIssues(
                    workspaceSlug.toString(),
                    projectId.toString(),
                    issues?.groupedIssueIds ? "mutation" : "init-loader"
                )
            }
        },
        { revalidateIfStale: false, revalidateOnFocus: false }
    )

    const activeLayout = issuesFilter?.issueFilters?.displayFilters?.layout

    if (!workspaceSlug || !projectId) return <></>

    if (issues?.loader === "init-loader" || !issues?.groupedIssueIds) {
        return <>{activeLayout && <ActiveLoader layout={activeLayout} />}</>
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden">
            <ProjectAppliedFiltersRoot />

            {issues?.groupedIssueIds?.length === 0 ? (
                <ProjectEmptyState />
            ) : (
                <Fragment>
                    <div className="relative h-full w-full overflow-auto bg-custom-background-90">
                        {/* mutation loader */}
                        {issues?.loader === "mutation" && (
                            <div className="fixed w-[40px] h-[40px] z-50 right-[20px] top-[70px] flex justify-center items-center bg-custom-background-80 shadow-sm rounded">
                                <Spinner className="w-4 h-4" />
                            </div>
                        )}
                        {activeLayout === "list" ? (
                            <ListLayout />
                        ) : activeLayout === "kanban" ? (
                            <KanBanLayout />
                        ) : activeLayout === "calendar" ? (
                            <CalendarLayout />
                        ) : activeLayout === "gantt_chart" ? (
                            <GanttLayout />
                        ) : activeLayout === "spreadsheet" ? (
                            <ProjectSpreadsheetLayout />
                        ) : null}
                    </div>

                    {/* peek overview */}
                    <IssuePeekOverview />
                </Fragment>
            )}
        </div>
    )
})
