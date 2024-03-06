import { FC, useMemo } from "react"

import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { useIssueDetail } from "@hooks/store"

import { renderEmoji } from "@helpers/emoji.helper"

import { IUser } from "@servcy/types"

import { ReactionSelector } from "./reaction-selector"

export type TIssueReaction = {
    workspaceSlug: string
    projectId: string
    issueId: string
    currentUser: IUser
}

export const IssueReaction: FC<TIssueReaction> = observer((props) => {
    const { workspaceSlug, projectId, issueId, currentUser } = props

    const {
        reaction: { getReactionsByIssueId, reactionsByUser },
        createReaction,
        removeReaction,
    } = useIssueDetail()

    const reactionIds = getReactionsByIssueId(issueId)
    const userReactions = reactionsByUser(issueId, currentUser.id).map((r) => r.reaction)

    const issueReactionOperations = useMemo(
        () => ({
            create: async (reaction: string) => {
                try {
                    if (!workspaceSlug || !projectId || !issueId) throw new Error("Missing fields")
                    await createReaction(workspaceSlug, projectId, issueId, reaction)
                    toast.error({
                        title: "Reaction created successfully",
                        type: "success",
                        message: "Reaction created successfully",
                    })
                } catch (error) {
                    toast.error({
                        title: "Reaction creation failed",
                        type: "error",
                        message: "Reaction creation failed",
                    })
                }
            },
            remove: async (reaction: string) => {
                try {
                    if (!workspaceSlug || !projectId || !issueId || !currentUser?.id) throw new Error("Missing fields")
                    await removeReaction(workspaceSlug, projectId, issueId, reaction, currentUser.id)
                    toast.error({
                        title: "Reaction removed successfully",
                        type: "success",
                        message: "Reaction removed successfully",
                    })
                } catch (error) {
                    toast.error({
                        title: "Reaction remove failed",
                        type: "error",
                        message: "Reaction remove failed",
                    })
                }
            },
            react: async (reaction: string) => {
                if (userReactions.includes(reaction)) await issueReactionOperations.remove(reaction)
                else await issueReactionOperations.create(reaction)
            },
        }),
        [workspaceSlug, projectId, issueId, currentUser, createReaction, removeReaction, setToastAlert, userReactions]
    )

    return (
        <div className="mt-4 relative flex items-center gap-1.5">
            <ReactionSelector size="md" position="top" value={userReactions} onSelect={issueReactionOperations.react} />

            {reactionIds &&
                Object.keys(reactionIds || {}).map(
                    (reaction) =>
                        reactionIds[reaction]?.length > 0 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => issueReactionOperations.react(reaction)}
                                    key={reaction}
                                    className={`flex h-full items-center gap-1 rounded-md px-2 py-1 text-sm text-custom-text-100 ${
                                        userReactions.includes(reaction)
                                            ? "bg-custom-primary-100/10"
                                            : "bg-custom-background-80"
                                    }`}
                                >
                                    <span>{renderEmoji(reaction)}</span>
                                    <span className={userReactions.includes(reaction) ? "text-custom-primary-100" : ""}>
                                        {(reactionIds || {})[reaction].length}{" "}
                                    </span>
                                </button>
                            </>
                        )
                )}
        </div>
    )
})
