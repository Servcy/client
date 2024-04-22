import { useParams } from "next/navigation"

import { FC } from "react"

import { Timer } from "lucide-react"
import { observer } from "mobx-react-lite"

import { useTimeTracker } from "@hooks/store"

import { Tooltip } from "@servcy/ui"

export const TimerFloatingWidget: FC<any> = observer(() => {
    const { stopIssueTimer } = useTimeTracker()
    const { workspaceSlug } = useParams()
    return (
        <div
            className="servcy-card-wrapper absolute bottom-8 right-8 cursor-pointer h-12 w-12 bg-custom-primary-800 hover:scale-150"
            onClick={() => stopIssueTimer(workspaceSlug.toString())}
        >
            <div className="servcy-card-content flex items-center justify-center gap-4 bg-custom-primary-800">
                <Tooltip tooltipContent="Stop timer">
                    <Timer className="size-4 text-custom-primary-100 focus:outline-none" />
                </Tooltip>
            </div>
        </div>
    )
})
