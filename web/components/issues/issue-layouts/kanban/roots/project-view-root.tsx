import { useRouter } from "next/router"

import React from "react"

import { observer } from "mobx-react-lite"

import { useIssues } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { TIssue } from "@servcy/types"

import { ProjectIssueQuickActions } from "../../quick-action-dropdowns"
import { EIssueActions } from "../../types"
import { BaseKanBanRoot } from "../base-kanban-root"

export interface IViewKanBanLayout {
    issueActions: {
        [EIssueActions.DELETE]: (issue: TIssue) => Promise<void>
        [EIssueActions.UPDATE]?: (issue: TIssue) => Promise<void>
        [EIssueActions.REMOVE]?: (issue: TIssue) => Promise<void>
        [EIssueActions.ARCHIVE]?: (issue: TIssue) => Promise<void>
    }
}

export const ProjectViewKanBanLayout: React.FC<IViewKanBanLayout> = observer((props) => {
    const { issueActions } = props
    // router
    const router = useRouter()
    const { viewId } = router.query

    const { issues, issuesFilter } = useIssues(EIssuesStoreType.PROJECT_VIEW)

    return (
        <BaseKanBanRoot
            issueActions={issueActions}
            issuesFilter={issuesFilter}
            issues={issues}
            showLoader={true}
            QuickActions={ProjectIssueQuickActions}
            storeType={EIssuesStoreType.PROJECT_VIEW}
            viewId={viewId?.toString()}
        />
    )
})
