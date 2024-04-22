import React, { FC } from "react"

import { Timer } from "lucide-react"
import { observer } from "mobx-react-lite"

import { Tooltip } from "@servcy/ui"

type ITimeTrackerWidget = {
    setIsConfirmationModalOpen: (value: boolean) => void
}

export const TimeTrackerWidget: FC<ITimeTrackerWidget> = observer(({ setIsConfirmationModalOpen }) => (
    <Tooltip tooltipContent="Stop timer">
        <div
            className="servcy-card-wrapper z-30 absolute bottom-8 right-8 cursor-pointer h-12 w-12 bg-custom-primary-800 hover:scale-125 transition-transform duration-300 ease-in-out"
            onClick={() => setIsConfirmationModalOpen(true)}
        >
            <div className="servcy-card-content flex items-center justify-center gap-4 bg-custom-primary-800">
                <Timer className="size-4 text-custom-primary-100 focus:outline-none" />
            </div>
        </div>
    </Tooltip>
))
