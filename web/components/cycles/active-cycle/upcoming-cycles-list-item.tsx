import Link from "next/link"
import { useParams } from "next/navigation"

import { Star, User2 } from "lucide-react"
import { observer } from "mobx-react"
import toast from "react-hot-toast"

import { CycleQuickActions } from "@components/cycles"

import { useCycle, useEventTracker, useMember } from "@hooks/store"

import { CYCLE_FAVORITED, CYCLE_UNFAVORITED } from "@constants/event-tracker"

import { renderFormattedDate } from "@helpers/date-time.helper"

import { Avatar, AvatarGroup } from "@servcy/ui"

type Props = {
    cycleId: string
}

export const UpcomingCycleListItem: React.FC<Props> = observer((props) => {
    const { cycleId } = props
    const { workspaceSlug, projectId } = useParams()
    const { captureEvent } = useEventTracker()
    const { addCycleToFavorites, getCycleById, removeCycleFromFavorites } = useCycle()
    const { getUserDetails } = useMember()
    const cycle = getCycleById(cycleId)

    const handleAddToFavorites = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!workspaceSlug || !projectId) return

        const addToFavoritePromise = addCycleToFavorites(workspaceSlug?.toString(), projectId.toString(), cycleId).then(
            () => {
                captureEvent(CYCLE_FAVORITED, {
                    cycle_id: cycleId,
                    element: "List layout",
                    state: "SUCCESS",
                })
            }
        )

        toast.promise(addToFavoritePromise, {
            loading: "Adding cycle to favorites...",
            success: "Cycle added to favorites.",
            error: "Please try again later",
        })
    }

    const handleRemoveFromFavorites = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!workspaceSlug || !projectId) return

        const removeFromFavoritePromise = removeCycleFromFavorites(
            workspaceSlug?.toString(),
            projectId.toString(),
            cycleId
        ).then(() => {
            captureEvent(CYCLE_UNFAVORITED, {
                cycle_id: cycleId,
                element: "List layout",
                state: "SUCCESS",
            })
        })

        toast.promise(removeFromFavoritePromise, {
            loading: "Removing cycle from favorites...",
            success: "Cycle removed from favorites.",
            error: "Please try again later",
        })
    }

    if (!cycle) return null

    return (
        <Link
            href={`/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}`}
            className="py-5 px-2 flex items-center justify-between gap-2 hover:bg-custom-background-90"
        >
            <h6 className="font-medium text-base">{cycle.name}</h6>
            <div className="flex items-center gap-4">
                {cycle.start_date && cycle.end_date && (
                    <div className="text-xs text-custom-text-300">
                        {renderFormattedDate(cycle.start_date)} - {renderFormattedDate(cycle.end_date)}
                    </div>
                )}
                {cycle.assignee_ids?.length > 0 ? (
                    <AvatarGroup showTooltip={false}>
                        {cycle.assignee_ids?.map((assigneeId) => {
                            const member = getUserDetails(assigneeId)
                            return <Avatar key={member?.id} name={member?.display_name} src={member?.avatar} />
                        })}
                    </AvatarGroup>
                ) : (
                    <span className="flex h-5 w-5 items-end justify-center rounded-full border border-dashed border-custom-text-400 bg-custom-background-80">
                        <User2 className="h-4 w-4 text-custom-text-400" />
                    </span>
                )}

                {cycle.is_favorite ? (
                    <button type="button" onClick={handleRemoveFromFavorites}>
                        <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                    </button>
                ) : (
                    <button type="button" onClick={handleAddToFavorites}>
                        <Star className="h-3.5 w-3.5 text-custom-text-200" />
                    </button>
                )}

                {workspaceSlug && projectId && (
                    <CycleQuickActions
                        cycleId={cycleId}
                        projectId={projectId.toString()}
                        workspaceSlug={workspaceSlug.toString()}
                    />
                )}
            </div>
        </Link>
    )
})
