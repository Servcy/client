import { useContext } from "react"
// mobx store
import { StoreContext } from "@contexts/StoreContext"
import { IEstimateStore } from "@store/estimate.store"

export const useEstimate = (): IEstimateStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useEstimate must be used within StoreProvider")
    return context.estimate
}
