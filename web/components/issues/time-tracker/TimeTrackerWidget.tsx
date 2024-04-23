import React, { FC } from "react"

import { Timer } from "lucide-react"
import { observer } from "mobx-react-lite"

import { useApplication } from "@hooks/store"

import { Tooltip } from "@servcy/ui"

export const TimeTrackerWidget: FC = observer(() => {
    const {
        commandPalette: { toggleTimeTrackerModal },
    } = useApplication()
    return (
        <Tooltip tooltipContent="Stop timer">
            <div
                className="servcy-card-wrapper z-30 absolute bottom-8 right-8 cursor-pointer h-12 w-12 bg-custom-primary-40 hover:scale-125 transition-transform duration-300 ease-in-out border border-dashed border-teal-600"
                onClick={() => toggleTimeTrackerModal()}
            >
                <div className="servcy-card-content flex items-center justify-center gap-4 bg-custom-primary-20">
                    <Timer
                        className="size-4 text-custom-primary-100 focus:outline-none"
                        style={{ strokeWidth: "3px" }}
                    />
                </div>
            </div>
        </Tooltip>
    )
})
