import { useContext } from "react"

import { StoreContext } from "@contexts/StoreContext"

import { ITimeTrackerFilterStore } from "@store/time-tracker-filter.store"

export const useTimeTrackerFilter = (): ITimeTrackerFilterStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useTimeTrackerFilter must be used within StoreProvider")
    return context.timeTracker
}
