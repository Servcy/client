import { useParams } from "next/navigation"

import { FC, useMemo } from "react"

import { observer } from "mobx-react-lite"

import { ProjectIssueQuickActions } from "@components/issues"

import { useIssues, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"
import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../../types"
import { BaseListRoot } from "../base-list-root"

export const ProfileIssuesListLayout: FC = observer(() => {
    const { workspaceSlug, userId } = useParams() as { workspaceSlug: string; userId: string }
    // store hooks
    const { issues, issuesFilter } = useIssues(EIssuesStoreType.PROFILE)

    const {
        membership: { currentWorkspaceAllProjectsRole },
    } = useUser()

    const issueActions = useMemo(
        () => ({
            [EIssueActions.UPDATE]: async (issue: TIssue) => {
                if (!workspaceSlug || !userId) return

                await issues.updateIssue(workspaceSlug, issue.project_id, issue.id, issue, userId)
            },
            [EIssueActions.DELETE]: async (issue: TIssue) => {
                if (!workspaceSlug || !userId) return

                await issues.removeIssue(workspaceSlug, issue.project_id, issue.id, userId)
            },
            [EIssueActions.ARCHIVE]: async (issue: TIssue) => {
                if (!workspaceSlug || !userId) return

                await issues.archiveIssue(workspaceSlug, issue.project_id, issue.id, userId)
            },
        }),
        [issues, workspaceSlug, userId]
    )

    const canEditPropertiesBasedOnProject = (projectId: string) => {
        const currentProjectRole = currentWorkspaceAllProjectsRole && currentWorkspaceAllProjectsRole[projectId]

        return !!currentProjectRole && currentProjectRole >= ERoles.MEMBER
    }

    return (
        <BaseListRoot
            issuesFilter={issuesFilter}
            issues={issues}
            QuickActions={ProjectIssueQuickActions}
            issueActions={issueActions}
            storeType={EIssuesStoreType.PROFILE}
            canEditPropertiesBasedOnProject={canEditPropertiesBasedOnProject}
        />
    )
})
