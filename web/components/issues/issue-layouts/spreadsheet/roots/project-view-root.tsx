import { useRouter } from "next/router"
import React from "react"
import { EIssuesStoreType } from "@constants/issue"
// mobx store
import { useIssues } from "@hooks/store"
import { observer } from "mobx-react-lite"
import { TIssue } from "@servcy/types"
import { ProjectIssueQuickActions } from "../../quick-action-dropdowns"
import { EIssueActions } from "../../types"
import { BaseSpreadsheetRoot } from "../base-spreadsheet-root"

export interface IViewSpreadsheetLayout {
    issueActions: {
        [EIssueActions.DELETE]: (issue: TIssue) => Promise<void>
        [EIssueActions.UPDATE]?: (issue: TIssue) => Promise<void>
        [EIssueActions.REMOVE]?: (issue: TIssue) => Promise<void>
        [EIssueActions.ARCHIVE]?: (issue: TIssue) => Promise<void>
    }
}

export const ProjectViewSpreadsheetLayout: React.FC<IViewSpreadsheetLayout> = observer((props) => {
    const { issueActions } = props
    // router
    const router = useRouter()
    const { viewId } = router.query

    const { issues, issuesFilter } = useIssues(EIssuesStoreType.PROJECT_VIEW)

    return (
        <BaseSpreadsheetRoot
            issueStore={issues}
            issueFiltersStore={issuesFilter}
            issueActions={issueActions}
            QuickActions={ProjectIssueQuickActions}
            viewId={viewId?.toString()}
        />
    )
})
