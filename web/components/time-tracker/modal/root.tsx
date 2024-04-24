import { FC } from "react"

import { observer } from "mobx-react-lite"

import { StartTimeTrackerModal, StopTimeTrackerModal } from "@components/time-tracker"

import { useTimeTracker } from "@hooks/store"

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
