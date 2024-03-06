import { useRouter } from "next/router"

import { useMemo } from "react"

import { observer } from "mobx-react-lite"

import { ProjectIssueQuickActions } from "@components/issues"

// mobx store
import { useIssues } from "@hooks/store/use-issues"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../../types"
import { BaseKanBanRoot } from "../base-kanban-root"

export interface IKanBanLayout {}

export const KanBanLayout: React.FC = observer(() => {
    const router = useRouter()
    const { workspaceSlug } = router.query as { workspaceSlug: string; projectId: string }

    const { issues, issuesFilter } = useIssues(EIssuesStoreType.PROJECT)

    const issueActions = useMemo(
        () => ({
            [EIssueActions.UPDATE]: async (issue: TIssue) => {
                if (!workspaceSlug) return

                await issues.updateIssue(workspaceSlug, issue.project_id, issue.id, issue)
            },
            [EIssueActions.DELETE]: async (issue: TIssue) => {
                if (!workspaceSlug) return

                await issues.removeIssue(workspaceSlug, issue.project_id, issue.id)
            },
            [EIssueActions.ARCHIVE]: async (issue: TIssue) => {
                if (!workspaceSlug) return

                await issues.archiveIssue(workspaceSlug, issue.project_id, issue.id)
            },
        }),
        [issues, workspaceSlug]
    )

    return (
        <BaseKanBanRoot
            issueActions={issueActions}
            issues={issues}
            issuesFilter={issuesFilter}
            showLoader={true}
            QuickActions={ProjectIssueQuickActions}
            storeType={EIssuesStoreType.PROJECT}
        />
    )
})
