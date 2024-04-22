import { FC } from "react"

export interface IIssueTimeTrackerProps {
    workspaceSlug: string
    projectId: string
    issueId: string
    disabled?: boolean
}

export const IssueTimeTracker: FC<IIssueTimeTrackerProps> = (props) => {
    const { workspaceSlug, projectId, issueId, disabled = false } = props
    return (
        <div className="relative py-3 space-y-3">
            <h3 className="text-lg">Time Tracker</h3>
            <div className="grid  grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" />
        </div>
    )
}
