import { useContext } from "react"

import { StoreContext } from "@contexts/StoreContext"

import { ICycleFilterStore } from "@store/cycle_filter.store"

export const useCycleFilter = (): ICycleFilterStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useCycleFilter must be used within StoreProvider")
    return context.cycleFilter
}
