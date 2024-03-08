import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"

import { ProjectIssueQuickActions } from "@components/issues"

import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { EIssueActions } from "../../types"
import { BaseCalendarRoot } from "../base-calendar-root"

export interface IViewCalendarLayout {
    issueActions: {
        [EIssueActions.DELETE]: (issue: TIssue) => Promise<void>
        [EIssueActions.UPDATE]?: (issue: TIssue) => Promise<void>
        [EIssueActions.REMOVE]?: (issue: TIssue) => Promise<void>
        [EIssueActions.ARCHIVE]?: (issue: TIssue) => Promise<void>
    }
}

export const ProjectViewCalendarLayout: React.FC<IViewCalendarLayout> = observer((props) => {
    const { issueActions } = props
    // store
    const { issues, issuesFilter } = useIssues(EIssuesStoreType.PROJECT_VIEW)
    const { viewId } = useParams()

    return (
        <BaseCalendarRoot
            issueStore={issues}
            issuesFilterStore={issuesFilter}
            QuickActions={ProjectIssueQuickActions}
            issueActions={issueActions}
            viewId={viewId?.toString()}
        />
    )
})
