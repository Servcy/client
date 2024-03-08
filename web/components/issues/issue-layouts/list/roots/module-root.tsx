import { useParams } from "next/navigation"

import React, { useMemo } from "react"

import { observer } from "mobx-react-lite"

import { ModuleIssueQuickActions } from "@components/issues"

// mobx store
import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../../types"
import { BaseListRoot } from "../base-list-root"

export interface IModuleListLayout {}

export const ModuleListLayout: React.FC = observer(() => {
    const { workspaceSlug, projectId, moduleId } = useParams()

    const { issues, issuesFilter } = useIssues(EIssuesStoreType.MODULE)

    const issueActions = useMemo(
        () => ({
            [EIssueActions.UPDATE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return

                await issues.updateIssue(
                    workspaceSlug.toString(),
                    issue.project_id,
                    issue.id,
                    issue,
                    moduleId.toString()
                )
            },
            [EIssueActions.DELETE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return

                await issues.removeIssue(workspaceSlug.toString(), issue.project_id, issue.id, moduleId.toString())
            },
            [EIssueActions.REMOVE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return

                await issues.removeIssueFromModule(
                    workspaceSlug.toString(),
                    issue.project_id,
                    moduleId.toString(),
                    issue.id
                )
            },
            [EIssueActions.ARCHIVE]: async (issue: TIssue) => {
                if (!workspaceSlug || !moduleId) return

                await issues.archiveIssue(workspaceSlug.toString(), issue.project_id, issue.id, moduleId.toString())
            },
        }),
        [issues, workspaceSlug, moduleId]
    )

    return (
        <BaseListRoot
            issuesFilter={issuesFilter}
            issues={issues}
            QuickActions={ModuleIssueQuickActions}
            issueActions={issueActions}
            viewId={moduleId?.toString()}
            storeType={EIssuesStoreType.MODULE}
            addIssuesToView={(issueIds: string[]) => {
                if (!workspaceSlug || !projectId || !moduleId) throw new Error()
                return issues.addIssuesToModule(
                    workspaceSlug.toString(),
                    projectId.toString(),
                    moduleId.toString(),
                    issueIds
                )
            }}
        />
    )
})
