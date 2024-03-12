import { FC } from "react"

import cn from "classnames"
import { Menu } from "lucide-react"
import { observer } from "mobx-react"

import { useApplication } from "@hooks/store"

type Props = {
    onClick?: () => void
    className?: string
}

export const SidebarHamburgerToggle: FC<Props> = observer((props) => {
    const { onClick } = props
    const { theme: themeStore } = useApplication()
    return (
        <div
            className={cn(
                "w-7 h-7 flex-shrink-0 rounded flex justify-center items-center bg-custom-background-80 transition-all hover:bg-custom-background-90 cursor-pointer group md:hidden",
                props.className
            )}
            onClick={() => {
                if (onClick) onClick()
                else themeStore.toggleSidebar()
            }}
        >
            <Menu size={14} className="text-custom-text-200 group-hover:text-custom-text-100 transition-all" />
        </div>
    )
})
