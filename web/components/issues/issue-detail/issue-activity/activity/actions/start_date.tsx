import { FC } from "react"
import { renderFormattedDate } from "@helpers/date-time.helper"
import { useIssueDetail } from "@hooks/store"
import { CalendarDays } from "lucide-react"
import { observer } from "mobx-react"
import { IssueActivityBlockComponent, IssueLink } from "./"

type TIssueStartDateActivity = { activityId: string; showIssue?: boolean; ends: "top" | "bottom" | undefined }

export const IssueStartDateActivity: FC<TIssueStartDateActivity> = observer((props) => {
    const { activityId, showIssue = true, ends } = props

    const {
        activity: { getActivityById },
    } = useIssueDetail()

    const activity = getActivityById(activityId)

    if (!activity) return <></>
    return (
        <IssueActivityBlockComponent
            icon={<CalendarDays size={14} color="#6b7280" aria-hidden="true" />}
            activityId={activityId}
            ends={ends}
        >
            <>
                {activity.new_value ? `set the start date to ` : `removed the start date `}
                {activity.new_value && (
                    <>
                        <span className="font-medium text-custom-text-100">
                            {renderFormattedDate(activity.new_value)}
                        </span>
                    </>
                )}
                {showIssue && (activity.new_value ? ` for ` : ` from `)}
                {showIssue && <IssueLink activityId={activityId} />}.
            </>
        </IssueActivityBlockComponent>
    )
})
