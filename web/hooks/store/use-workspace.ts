import { useContext } from "react"

// mobx store
import { StoreContext } from "@contexts/StoreContext"

import { StoreIWorkspaceStore } from "@store/workspace"

export const useWorkspace = (): StoreIWorkspaceStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useWorkspace must be used within StoreProvider")
    return context.workspace
}
