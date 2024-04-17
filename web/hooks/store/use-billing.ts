import { useContext } from "react"

import { StoreContext } from "@contexts/StoreContext"

import { StoreIBillingStore } from "@store/billing.store"

export const useBilling = (): StoreIBillingStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useBilling must be used within StoreProvider")
    return context.billing
}
