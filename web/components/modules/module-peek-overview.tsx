import { usePathname, useRouter, useSearchParams } from "next/navigation"

import React, { useEffect } from "react"

import { observer } from "mobx-react-lite"

import { useModule } from "@hooks/store"

import { ModuleDetailsSidebar } from "./sidebar"

type Props = {
    projectId: string
    workspaceSlug: string
}

export const ModulePeekOverview: React.FC<Props> = observer(({ projectId, workspaceSlug }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    // refs
    const ref = React.useRef(null)
    // store hooks
    const { fetchModuleDetails } = useModule()

    const handleClose = () => {
        router.push(pathname)
    }

    useEffect(() => {
        if (!searchParams.has("peekModule")) return
        fetchModuleDetails(workspaceSlug, projectId, searchParams.get("peekModule") as string)
    }, [fetchModuleDetails, searchParams, projectId, workspaceSlug])

    return (
        <>
            {searchParams.has("peekModule") && (
                <div
                    ref={ref}
                    className="flex h-full w-full max-w-[24rem] flex-shrink-0 flex-col gap-3.5 overflow-y-auto border-l border-custom-border-100 bg-custom-sidebar-background-100 px-6 py-3.5 duration-300 absolute md:relative right-0 z-[9]"
                    style={{
                        boxShadow:
                            "0px 1px 4px 0px rgba(0, 0, 0, 0.06), 0px 2px 4px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px -1px rgba(16, 24, 40, 0.06)",
                    }}
                >
                    <ModuleDetailsSidebar
                        moduleId={searchParams.get("peekModule") as string}
                        handleClose={handleClose}
                    />
                </div>
            )}
        </>
    )
})
