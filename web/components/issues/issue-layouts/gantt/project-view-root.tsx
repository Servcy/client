import { useRouter } from "next/navigation"

import { observer } from "mobx-react-lite"

import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../types"
import { BaseGanttRoot } from "./base-gantt-root"

export interface IViewGanttLayout {
    issueActions: {
        [EIssueActions.DELETE]: (issue: TIssue) => Promise<void>
        [EIssueActions.UPDATE]?: (issue: TIssue) => Promise<void>
        [EIssueActions.REMOVE]?: (issue: TIssue) => Promise<void>
    }
}

export const ProjectViewGanttLayout: React.FC<IViewGanttLayout> = observer((props) => {
    const { issueActions } = props
    // store
    const { issues, issuesFilter } = useIssues(EIssuesStoreType.PROJECT_VIEW)
    // router
    const router = useRouter()
    const { viewId } = router.query

    return (
        <BaseGanttRoot
            issueFiltersStore={issuesFilter}
            issueStore={issues}
            issueActions={issueActions}
            viewId={viewId?.toString()}
        />
    )
})
