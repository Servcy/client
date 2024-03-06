import { FC } from "react";
import { observer } from "mobx-react";
import { MessageSquare } from "lucide-react";

import { useIssueDetail } from "@hooks/store";

import { IssueActivityBlockComponent } from "./";

type TIssueNameActivity = { activityId: string; ends: "top" | "bottom" | undefined };

export const IssueNameActivity: FC<TIssueNameActivity> = observer((props) => {
    const { activityId, ends } = props;

    const {
        activity: { getActivityById },
    } = useIssueDetail();

    const activity = getActivityById(activityId);

    if (!activity) return <></>;
    return (
        <IssueActivityBlockComponent
            icon={<MessageSquare size={14} color="#6b7280" aria-hidden="true" />}
            activityId={activityId}
            ends={ends}
        >
            <>set the name to {activity.new_value}.</>
        </IssueActivityBlockComponent>
    );
});
