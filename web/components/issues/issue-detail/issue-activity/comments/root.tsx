import { FC } from "react"
import { useIssueDetail } from "@hooks/store"
import { observer } from "mobx-react-lite"
import { TActivityOperations } from "../root"
import { IssueCommentCard } from "./comment-card"

type TIssueCommentRoot = {
    workspaceSlug: string
    issueId: string
    activityOperations: TActivityOperations
    showAccessSpecifier?: boolean
}

export const IssueCommentRoot: FC<TIssueCommentRoot> = observer((props) => {
    const { workspaceSlug, issueId, activityOperations, showAccessSpecifier } = props

    const {
        comment: { getCommentsByIssueId },
    } = useIssueDetail()

    const commentIds = getCommentsByIssueId(issueId)
    if (!commentIds) return <></>

    return (
        <div>
            {commentIds.map((commentId, index) => (
                <IssueCommentCard
                    workspaceSlug={workspaceSlug}
                    commentId={commentId}
                    ends={index === 0 ? "top" : index === commentIds.length - 1 ? "bottom" : undefined}
                    activityOperations={activityOperations}
                    showAccessSpecifier={showAccessSpecifier}
                />
            ))}
        </div>
    )
})
