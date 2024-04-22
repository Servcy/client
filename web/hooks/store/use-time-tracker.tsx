import { useContext } from "react"

import { StoreContext } from "@contexts/StoreContext"

import { ITimerStore } from "@store/timer.store"

export const useTimeTracker = (): ITimerStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useTimeTracker must be used within StoreProvider")
    return context.timer
}
