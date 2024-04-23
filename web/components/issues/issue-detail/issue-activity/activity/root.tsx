import { FC } from "react"

import { observer } from "mobx-react-lite"

import { useIssueDetail } from "@hooks/store"

import { IssueActivityList } from "./activity-list"

type TIssueActivityRoot = {
    issueId: string
}

export const IssueActivityRoot: FC<TIssueActivityRoot> = observer((props) => {
    const { issueId } = props

    const {
        activity: { getActivitiesByIssueId },
    } = useIssueDetail()

    const activityIds = getActivitiesByIssueId(issueId)

    if (!activityIds)
        return <div className="flex items-center justify-center h-40 text-custom-text-100">No activity found.</div>

    return (
        <div>
            {activityIds.map((activityId, index) => (
                <IssueActivityList
                    activityId={activityId}
                    ends={index === 0 ? "top" : index === activityIds.length - 1 ? "bottom" : undefined}
                />
            ))}
        </div>
    )
})
