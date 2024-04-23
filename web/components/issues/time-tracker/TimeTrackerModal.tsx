import { FC } from "react"

import { observer } from "mobx-react-lite"

import { useTimeTracker } from "@hooks/store"

import { StartTimeTrackerModal } from "./StartTimeTrackerModal"
import { StopTimeTrackerModal } from "./StopTimeTrackerModal"

interface ITimeTrackerModal {
    isOpen: boolean
    handleClose: () => void
}

export const TimeTrackerModal: FC<ITimeTrackerModal> = observer(({ isOpen, handleClose }) => {
    const { runningTimeTracker } = useTimeTracker()
    return (
        <>
            {runningTimeTracker ? (
                <StopTimeTrackerModal isOpen={isOpen} handleClose={handleClose} />
            ) : (
                <StartTimeTrackerModal isOpen={isOpen} handleClose={handleClose} />
            )}
        </>
    )
})
