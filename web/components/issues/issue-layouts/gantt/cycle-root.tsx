import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"

import { useCycle, useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../types"
import { BaseGanttRoot } from "./base-gantt-root"

export const CycleGanttLayout: React.FC = observer(() => {

    const { workspaceSlug, cycleId } = useParams()
    // store hooks
    const { issues, issuesFilter } = useIssues(EIssuesStoreType.CYCLE)
    const { fetchCycleDetails } = useCycle()

    const issueActions = {
        [EIssueActions.UPDATE]: async (issue: TIssue) => {
            if (!workspaceSlug || !cycleId) return

            await issues.updateIssue(workspaceSlug.toString(), issue.project_id, issue.id, issue, cycleId.toString())
            fetchCycleDetails(workspaceSlug.toString(), issue.project_id, cycleId.toString())
        },
        [EIssueActions.DELETE]: async (issue: TIssue) => {
            if (!workspaceSlug || !cycleId) return

            await issues.removeIssue(workspaceSlug.toString(), issue.project_id, issue.id, cycleId.toString())
            fetchCycleDetails(workspaceSlug.toString(), issue.project_id, cycleId.toString())
        },
        [EIssueActions.REMOVE]: async (issue: TIssue) => {
            if (!workspaceSlug || !cycleId || !issue.id) return

            await issues.removeIssueFromCycle(workspaceSlug.toString(), issue.project_id, cycleId.toString(), issue.id)
            fetchCycleDetails(workspaceSlug.toString(), issue.project_id, cycleId.toString())
        },
    }

    return (
        <BaseGanttRoot
            issueActions={issueActions}
            issueFiltersStore={issuesFilter}
            issueStore={issues}
            viewId={cycleId?.toString()}
        />
    )
})
