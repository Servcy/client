import { useRouter } from "next/router"

import { FC, useMemo } from "react"

import { observer } from "mobx-react-lite"

import { ProjectIssueQuickActions } from "@components/issues"

import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../../types"
import { BaseListRoot } from "../base-list-root"

export const DraftIssueListLayout: FC = observer(() => {
    const router = useRouter()
    const { workspaceSlug, projectId } = router.query as { workspaceSlug: string; projectId: string }

    if (!workspaceSlug || !projectId) return null

    // store
    const { issues, issuesFilter } = useIssues(EIssuesStoreType.DRAFT)

    const issueActions = useMemo(
        () => ({
            [EIssueActions.UPDATE]: async (issue: TIssue) => {
                if (!workspaceSlug || !projectId) return

                await issues.updateIssue(workspaceSlug, projectId, issue.id, issue)
            },
            [EIssueActions.DELETE]: async (issue: TIssue) => {
                if (!workspaceSlug || !projectId) return

                await issues.removeIssue(workspaceSlug, projectId, issue.id)
            },
        }),
        [issues, workspaceSlug, projectId]
    )

    return (
        <BaseListRoot
            issuesFilter={issuesFilter}
            issues={issues}
            QuickActions={ProjectIssueQuickActions}
            issueActions={issueActions}
            storeType={EIssuesStoreType.PROJECT}
        />
    )
})
