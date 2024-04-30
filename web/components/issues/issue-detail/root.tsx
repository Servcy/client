import { usePathname, useRouter } from "next/navigation"

import { FC, useMemo } from "react"

import { observer } from "mobx-react"
import emptyIssue from "public/empty-state/issue.svg"
import toast from "react-hot-toast"

import { EmptyState } from "@components/common"
import { IssuePeekOverview } from "@components/issues"

import { useApplication, useEventTracker, useIssueDetail, useIssues, useUser } from "@hooks/store"

import { ISSUE_ARCHIVED, ISSUE_DELETED, ISSUE_UPDATED } from "@constants/event-tracker"
import { ERoles } from "@constants/iam"
import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { IssueMainContent } from "./main-content"
import { IssueDetailsSidebar } from "./sidebar"

export type TIssueOperations = {
    fetch: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>
    update: (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<TIssue>,
        showToast?: boolean
    ) => Promise<void>
    remove: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>
    archive?: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>
    restore?: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>
    addIssueToCycle?: (workspaceSlug: string, projectId: string, cycleId: string, issueIds: string[]) => Promise<void>
    removeIssueFromCycle?: (workspaceSlug: string, projectId: string, cycleId: string, issueId: string) => Promise<void>
    addModulesToIssue?: (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        moduleIds: string[]
    ) => Promise<void>
    removeIssueFromModule?: (
        workspaceSlug: string,
        projectId: string,
        moduleId: string,
        issueId: string
    ) => Promise<void>
    removeModulesFromIssue?: (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        moduleIds: string[]
    ) => Promise<void>
}

export type TIssueDetailRoot = {
    workspaceSlug: string
    projectId: string
    issueId: string
    is_archived?: boolean
}

export const IssueDetailRoot: FC<TIssueDetailRoot> = observer((props) => {
    const { workspaceSlug, projectId, issueId, is_archived = false } = props

    const router = useRouter()
    const pathname = usePathname()

    const {
        issue: { getIssueById },
        fetchIssue,
        updateIssue,
        removeIssue,
        archiveIssue,
        addIssueToCycle,
        removeIssueFromCycle,
        addModulesToIssue,
        removeIssueFromModule,
        removeModulesFromIssue,
    } = useIssueDetail()
    const {
        issues: { removeIssue: removeArchivedIssue },
    } = useIssues(EIssuesStoreType.ARCHIVED)
    const { captureIssueEvent } = useEventTracker()

    const {
        membership: { currentProjectRole },
    } = useUser()
    const { theme: themeStore } = useApplication()

    const issueOperations: TIssueOperations = useMemo(
        () => ({
            fetch: async (workspaceSlug: string, projectId: string, issueId: string) => {
                try {
                    await fetchIssue(workspaceSlug, projectId, issueId)
                } catch (error) {
                    console.error("Error fetching the parent issue")
                }
            },
            update: async (
                workspaceSlug: string,
                projectId: string,
                issueId: string,
                data: Partial<TIssue>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                showToast: boolean = true
            ) => {
                try {
                    await updateIssue(workspaceSlug, projectId, issueId, data)
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { ...data, issueId, state: "SUCCESS", element: "Issue detail page" },
                        updates: {
                            changed_property: Object.keys(data).join(","),
                            change_details: Object.values(data).join(","),
                        },
                        path: pathname,
                    })
                } catch (error) {
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { state: "FAILED", element: "Issue detail page" },
                        updates: {
                            changed_property: Object.keys(data).join(","),
                            change_details: Object.values(data).join(","),
                        },
                        path: pathname,
                    })
                    toast.error("Issue update failed")
                }
            },
            remove: async (workspaceSlug: string, projectId: string, issueId: string) => {
                try {
                    if (is_archived) await removeArchivedIssue(workspaceSlug, projectId, issueId)
                    else await removeIssue(workspaceSlug, projectId, issueId)
                    captureIssueEvent({
                        eventName: ISSUE_DELETED,
                        payload: { id: issueId, state: "SUCCESS", element: "Issue detail page" },
                        path: pathname,
                    })
                } catch (error) {
                    toast.error("Issue delete failed")
                    captureIssueEvent({
                        eventName: ISSUE_DELETED,
                        payload: { id: issueId, state: "FAILED", element: "Issue detail page" },
                        path: pathname,
                    })
                }
            },
            archive: async (workspaceSlug: string, projectId: string, issueId: string) => {
                try {
                    await archiveIssue(workspaceSlug, projectId, issueId)
                    captureIssueEvent({
                        eventName: ISSUE_ARCHIVED,
                        payload: { id: issueId, state: "SUCCESS", element: "Issue details page" },
                        path: pathname,
                    })
                } catch (error) {
                    toast.error("Issue could not be archived. Please try again.")
                    captureIssueEvent({
                        eventName: ISSUE_ARCHIVED,
                        payload: { id: issueId, state: "FAILED", element: "Issue details page" },
                        path: pathname,
                    })
                }
            },
            addIssueToCycle: async (workspaceSlug: string, projectId: string, cycleId: string, issueIds: string[]) => {
                try {
                    await addIssueToCycle(workspaceSlug, projectId, cycleId, issueIds)
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { ...issueIds, state: "SUCCESS", element: "Issue detail page" },
                        updates: {
                            changed_property: "cycle_id",
                            change_details: cycleId,
                        },
                        path: pathname,
                    })
                } catch (error) {
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { state: "FAILED", element: "Issue detail page" },
                        updates: {
                            changed_property: "cycle_id",
                            change_details: cycleId,
                        },
                        path: pathname,
                    })
                    toast.error("Cycle add to issue failed")
                }
            },
            removeIssueFromCycle: async (
                workspaceSlug: string,
                projectId: string,
                cycleId: string,
                issueId: string
            ) => {
                try {
                    const response = await removeIssueFromCycle(workspaceSlug, projectId, cycleId, issueId)
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { ...response, state: "SUCCESS", element: "Issue detail page" },
                        updates: {
                            changed_property: "cycle_id",
                            change_details: "",
                        },
                        path: pathname,
                    })
                } catch (error) {
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { state: "FAILED", element: "Issue detail page" },
                        updates: {
                            changed_property: "cycle_id",
                            change_details: "",
                        },
                        path: pathname,
                    })
                    toast.error("Cycle remove from issue failed")
                }
            },
            addModulesToIssue: async (
                workspaceSlug: string,
                projectId: string,
                issueId: string,
                moduleIds: string[]
            ) => {
                try {
                    const response = await addModulesToIssue(workspaceSlug, projectId, issueId, moduleIds)
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { ...response, state: "SUCCESS", element: "Issue detail page" },
                        updates: {
                            changed_property: "module_id",
                            change_details: moduleIds,
                        },
                        path: pathname,
                    })
                } catch (error) {
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { id: issueId, state: "FAILED", element: "Issue detail page" },
                        updates: {
                            changed_property: "module_id",
                            change_details: moduleIds,
                        },
                        path: pathname,
                    })
                    toast.error("Module add to issue failed")
                }
            },
            removeIssueFromModule: async (
                workspaceSlug: string,
                projectId: string,
                moduleId: string,
                issueId: string
            ) => {
                try {
                    await removeIssueFromModule(workspaceSlug, projectId, moduleId, issueId)
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { id: issueId, state: "SUCCESS", element: "Issue detail page" },
                        updates: {
                            changed_property: "module_id",
                            change_details: "",
                        },
                        path: pathname,
                    })
                } catch (error) {
                    captureIssueEvent({
                        eventName: ISSUE_UPDATED,
                        payload: { id: issueId, state: "FAILED", element: "Issue detail page" },
                        updates: {
                            changed_property: "module_id",
                            change_details: "",
                        },
                        path: pathname,
                    })
                    toast.error("Module remove from issue failed")
                }
            },
            removeModulesFromIssue: async (
                workspaceSlug: string,
                projectId: string,
                issueId: string,
                moduleIds: string[]
            ) => {
                try {
                    await removeModulesFromIssue(workspaceSlug, projectId, issueId, moduleIds)
                } catch (error) {
                    toast.error("Issue could not be removed from module. Please try again.")
                }
            },
        }),
        [
            fetchIssue,
            updateIssue,
            captureIssueEvent,
            pathname,
            is_archived,
            removeArchivedIssue,
            removeIssue,
            archiveIssue,
            addIssueToCycle,
            removeIssueFromCycle,
            addModulesToIssue,
            removeIssueFromModule,
            removeModulesFromIssue,
        ]
    )

    // issue details
    const issue = getIssueById(issueId)
    // checking if issue is editable, based on user role
    const is_editable = currentProjectRole !== undefined && currentProjectRole >= ERoles.MEMBER

    return (
        <>
            {!issue ? (
                <EmptyState
                    image={emptyIssue}
                    title="Issue does not exist"
                    description="The issue you are looking for does not exist, has been archived, or has been deleted."
                    primaryButton={{
                        text: "View other issues",
                        onClick: () => router.push(`/${workspaceSlug}/projects/${projectId}/issues`),
                    }}
                />
            ) : (
                <div className="flex w-full h-full overflow-hidden">
                    <div className="h-full w-full max-w-2/3 space-y-5 divide-y-2 divide-custom-border-200 overflow-y-auto p-5">
                        <IssueMainContent
                            workspaceSlug={workspaceSlug}
                            projectId={projectId}
                            issueId={issueId}
                            issueOperations={issueOperations}
                            is_editable={!is_archived && is_editable}
                        />
                    </div>
                    <div
                        className="h-full w-full min-w-[300px] lg:min-w-80 xl:min-w-96 sm:w-1/2 md:w-1/3 space-y-5 overflow-hidden border-l border-custom-border-200 py-5 fixed md:relative bg-custom-sidebar-background-100 right-0 z-[5]"
                        style={themeStore.issueDetailSidebarCollapsed ? { right: `-${window?.innerWidth || 0}px` } : {}}
                    >
                        <IssueDetailsSidebar
                            workspaceSlug={workspaceSlug}
                            projectId={projectId}
                            issueId={issueId}
                            issueOperations={issueOperations}
                            is_archived={is_archived}
                            is_editable={!is_archived && is_editable}
                        />
                    </div>
                </div>
            )}

            {/* peek overview */}
            <IssuePeekOverview />
        </>
    )
})
