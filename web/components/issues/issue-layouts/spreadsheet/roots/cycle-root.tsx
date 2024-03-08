import { useParams } from "next/navigation"

import React, { useCallback, useMemo } from "react"

import { observer } from "mobx-react-lite"

// mobx store
import { useCycle, useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { CycleIssueQuickActions } from "../../quick-action-dropdowns"
import { EIssueActions } from "../../types"
import { BaseSpreadsheetRoot } from "../base-spreadsheet-root"

export const CycleSpreadsheetLayout: React.FC = observer(() => {
    const { workspaceSlug, cycleId } = useParams() as { workspaceSlug: string; cycleId: string }

    const { issues, issuesFilter } = useIssues(EIssuesStoreType.CYCLE)
    const { currentProjectCompletedCycleIds } = useCycle()

    const issueActions = useMemo(
        () => ({
            [EIssueActions.UPDATE]: async (issue: TIssue) => {
                if (!workspaceSlug || !cycleId) return

                issues.updateIssue(workspaceSlug, issue.project_id, issue.id, issue, cycleId)
            },
            [EIssueActions.DELETE]: async (issue: TIssue) => {
                if (!workspaceSlug || !cycleId) return
                issues.removeIssue(workspaceSlug, issue.project_id, issue.id, cycleId)
            },
            [EIssueActions.REMOVE]: async (issue: TIssue) => {
                if (!workspaceSlug || !cycleId) return
                issues.removeIssueFromCycle(workspaceSlug, issue.project_id, cycleId, issue.id)
            },
            [EIssueActions.ARCHIVE]: async (issue: TIssue) => {
                if (!workspaceSlug || !cycleId) return
                issues.archiveIssue(workspaceSlug, issue.project_id, issue.id, cycleId)
            },
        }),
        [issues, workspaceSlug, cycleId]
    )

    const isCompletedCycle =
        cycleId && currentProjectCompletedCycleIds
            ? currentProjectCompletedCycleIds.includes(cycleId.toString())
            : false

    const canEditIssueProperties = useCallback(() => !isCompletedCycle, [isCompletedCycle])

    return (
        <BaseSpreadsheetRoot
            issueStore={issues}
            issueFiltersStore={issuesFilter}
            viewId={cycleId}
            issueActions={issueActions}
            QuickActions={CycleIssueQuickActions}
            canEditPropertiesBasedOnProject={canEditIssueProperties}
            isCompletedCycle={isCompletedCycle}
        />
    )
})
