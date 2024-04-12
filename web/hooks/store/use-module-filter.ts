import { useContext } from "react"

import { StoreContext } from "contexts/StoreContext"
import { IModuleFilterStore } from "store/module_filter.store"

export const useModuleFilter = (): IModuleFilterStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useModuleFilter must be used within StoreProvider")
    return context.moduleFilter
}
