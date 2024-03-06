import { FC } from "react"
import { useIssueDetail } from "@hooks/store"
import { observer } from "mobx-react"
import { DoubleCircleIcon } from "@servcy/ui"
import { IssueActivityBlockComponent, IssueLink } from "./"

type TIssueStateActivity = { activityId: string; showIssue?: boolean; ends: "top" | "bottom" | undefined }

export const IssueStateActivity: FC<TIssueStateActivity> = observer((props) => {
    const { activityId, showIssue = true, ends } = props

    const {
        activity: { getActivityById },
    } = useIssueDetail()

    const activity = getActivityById(activityId)

    if (!activity) return <></>
    return (
        <IssueActivityBlockComponent
            icon={<DoubleCircleIcon className="h-4 w-4 flex-shrink-0" />}
            activityId={activityId}
            ends={ends}
        >
            <>
                set the state to <span className="font-medium text-custom-text-100">{activity.new_value}</span>
                {showIssue ? ` for ` : ``}
                {showIssue && <IssueLink activityId={activityId} />}.
            </>
        </IssueActivityBlockComponent>
    )
})
