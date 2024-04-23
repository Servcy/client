import { useContext } from "react"

import { StoreContext } from "@contexts/StoreContext"

import { ITimeTrackerStore } from "@store/time-tracker.store"

export const useTimeTracker = (): ITimeTrackerStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useTimeTracker must be used within StoreProvider")
    return context.timeTracker
}
