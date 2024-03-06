import { useRouter } from "next/router"

import { useMemo } from "react"

import { observer } from "mobx-react-lite"

import { ProjectIssueQuickActions } from "@components/issues"

import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../../types"
import { BaseKanBanRoot } from "../base-kanban-root"

export interface IKanBanLayout {}

export const DraftKanBanLayout: React.FC = observer(() => {
    const router = useRouter()
    const { workspaceSlug } = router.query

    // store
    const { issues, issuesFilter } = useIssues(EIssuesStoreType.DRAFT)

    const issueActions = useMemo(
        () => ({
            [EIssueActions.UPDATE]: async (issue: TIssue) => {
                if (!workspaceSlug) return

                await issues.updateIssue(workspaceSlug.toString(), issue.project_id, issue.id, issue)
            },
            [EIssueActions.DELETE]: async (issue: TIssue) => {
                if (!workspaceSlug) return

                await issues.removeIssue(workspaceSlug.toString(), issue.project_id, issue.id)
            },
        }),
        [issues, workspaceSlug]
    )

    return (
        <BaseKanBanRoot
            issueActions={issueActions}
            issuesFilter={issuesFilter}
            issues={issues}
            showLoader={true}
            QuickActions={ProjectIssueQuickActions}
        />
    )
})
