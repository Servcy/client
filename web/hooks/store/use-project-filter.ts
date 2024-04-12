import { useContext } from "react"

import { StoreContext } from "@contexts/store-context"

import { IProjectFilterStore } from "@store/project/project_filter.store"

export const useProjectFilter = (): IProjectFilterStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useProjectFilter must be used within StoreProvider")
    return context.projectRoot.projectFilter
}
