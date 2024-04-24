import { useContext } from "react"

import { StoreContext } from "@contexts/StoreContext"

import { ITimeTrackerFilter } from "@store/time-tracker-filter.store"

export const useTimeTrackerFilter = (): ITimeTrackerFilter => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useTimeTrackerFilter must be used within StoreProvider")
    return context.timeTrackerFilter
}
