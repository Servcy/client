import { FC } from "react"

import { observer } from "mobx-react"

import { useIssueDetail } from "@hooks/store"

import { GithubIcon } from "@servcy/ui"

import { IssueActivityBlockComponent, IssueLink } from "./"

type TIssueAssigneeActivity = { activityId: string; showIssue?: boolean; ends: "top" | "bottom" | undefined }

export const IssueGithubActivity: FC<TIssueAssigneeActivity> = observer((props) => {
    const { activityId, ends, showIssue = true } = props

    const {
        activity: { getActivityById },
    } = useIssueDetail()

    const activity = getActivityById(activityId)

    if (!activity) return <></>
    return (
        <IssueActivityBlockComponent
            icon={<GithubIcon className="h-4 w-4 flex-shrink-0" />}
            activityId={activityId}
            ends={ends}
        >
            <>
                added a new {activity.comment}
                <a
                    href={activity.old_value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-custom-text-100 hover:underline capitalize"
                >
                    {activity.new_value}
                </a>
                {showIssue && ` to `}
                {showIssue && <IssueLink activityId={activityId} />}.
            </>
        </IssueActivityBlockComponent>
    )
})
