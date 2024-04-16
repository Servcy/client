import React, { useEffect } from "react"

import { Gem, LifeBuoy, MoveLeft, Zap } from "lucide-react"
import { observer } from "mobx-react-lite"

import { useApplication } from "@hooks/store"

import { Tooltip } from "@servcy/ui"

export interface WorkspaceHelpSectionProps {
    setSidebarActive?: React.Dispatch<React.SetStateAction<boolean>>
}

export const WorkspaceHelpSection: React.FC<WorkspaceHelpSectionProps> = observer(() => {
    const {
        theme: { sidebarCollapsed, toggleSidebar },
        commandPalette: { toggleShortcutModal, isSupportModalOpen, toggleUpgradePlanModal, toggleSupportModal },
    } = useApplication()
    const isCollapsed = sidebarCollapsed || false

    useEffect(() => {
        if (isSupportModalOpen && FreshworksWidget) FreshworksWidget("open")
        else if (FreshworksWidget) FreshworksWidget("close")
    }, [isSupportModalOpen])

    return (
        <>
            <div
                className={`flex w-full items-center justify-between gap-1 self-baseline border-t border-custom-border-200 bg-custom-sidebar-background-100 px-4 py-2 ${
                    isCollapsed ? "flex-col" : ""
                }`}
            >
                {!isCollapsed && (
                    <button
                        onClick={() => toggleUpgradePlanModal(true)}
                        className="w-1/2 flex cursor-default rounded-md bg-green-500/10 px-2.5 py-1.5 text-center text-sm font-medium text-green-500 outline-none"
                    >
                        <Gem className="mr-2" size={16} />
                        Upgrade Plan
                    </button>
                )}
                <div
                    className={`flex items-center gap-1 ${
                        isCollapsed ? "flex-col justify-center" : "w-1/2 justify-evenly"
                    }`}
                >
                    <Tooltip tooltipContent="Shortcuts">
                        <button
                            type="button"
                            className={`grid place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 ${
                                isCollapsed ? "w-full" : ""
                            }`}
                            onClick={() => toggleShortcutModal(true)}
                        >
                            <Zap className="h-3.5 w-3.5" />
                        </button>
                    </Tooltip>
                    <Tooltip tooltipContent="Support">
                        <button
                            type="button"
                            className={`grid place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 ${
                                isCollapsed ? "w-full" : ""
                            }`}
                            onClick={() => toggleSupportModal(true)}
                        >
                            <LifeBuoy className="h-3.5 w-3.5" />
                        </button>
                    </Tooltip>
                    <button
                        type="button"
                        className="grid place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 md:hidden"
                        onClick={() => toggleSidebar()}
                    >
                        <MoveLeft className="h-3.5 w-3.5" />
                    </button>

                    <Tooltip tooltipContent={`${isCollapsed ? "Expand" : "Hide"}`}>
                        <button
                            type="button"
                            className={`hidden place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 md:grid ${
                                isCollapsed ? "w-full" : ""
                            }`}
                            onClick={() => toggleSidebar()}
                        >
                            <MoveLeft className={`h-3.5 w-3.5 duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </>
    )
})
