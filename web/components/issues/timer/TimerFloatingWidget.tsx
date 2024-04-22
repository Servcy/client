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
        <Tooltip tooltipContent="Stop timer">
            <div
                className="servcy-card-wrapper absolute bottom-8 right-8 cursor-pointer h-12 w-12 bg-custom-primary-800 hover:scale-125 transition-transform duration-300 ease-in-out"
                onClick={() => stopIssueTimer(workspaceSlug.toString())}
            >
                <div className="servcy-card-content flex items-center justify-center gap-4 bg-custom-primary-800">
                    <Timer className="size-4 text-custom-primary-100 focus:outline-none" />
                </div>
            </div>
        </Tooltip>
    )
})
