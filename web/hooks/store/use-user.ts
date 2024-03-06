import { useContext } from "react"
// mobx store
import { StoreContext } from "@contexts/StoreContext"
import { IUserRootStore } from "@store/user"

export const useUser = (): IUserRootStore => {
    const context = useContext(StoreContext)
    if (context === undefined) throw new Error("useUser must be used within StoreProvider")
    return context.user
}
