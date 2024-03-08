import { useRouter } from "next/navigation"

import { useMemo } from "react"

import { observer } from "mobx-react-lite"

import { ModuleIssueQuickActions } from "@components/issues"

// hoks
import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../../types"
import { BaseCalendarRoot } from "../base-calendar-root"

export const ModuleCalendarLayout: React.FC = observer(() => {
    const { issues, issuesFilter } = useIssues(EIssuesStoreType.MODULE)
    const router = useRouter()
    const { workspaceSlug, moduleId } = router.query as {
        workspaceSlug: string
        projectId: string
        moduleId: string
    }

    const issueActions = useMemo(
        () => ({
            [EIssueActions.UPDATE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return
                await issues.updateIssue(workspaceSlug, issue.project_id, issue.id, issue, moduleId)
            },
            [EIssueActions.DELETE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return
                await issues.removeIssue(workspaceSlug, issue.project_id, issue.id, moduleId)
            },
            [EIssueActions.REMOVE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return
                await issues.removeIssueFromModule(workspaceSlug, issue.project_id, moduleId, issue.id)
            },
            [EIssueActions.ARCHIVE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return
                await issues.archiveIssue(workspaceSlug, issue.project_id, issue.id, moduleId)
            },
        }),
        [issues, workspaceSlug, moduleId]
    )

    return (
        <BaseCalendarRoot
            issueStore={issues}
            issuesFilterStore={issuesFilter}
            QuickActions={ModuleIssueQuickActions}
            issueActions={issueActions}
            viewId={moduleId}
        />
    )
})
