import { usePathname, useRouter, useSearchParams } from "next/navigation"

import React, { useEffect } from "react"

import { observer } from "mobx-react-lite"

import { useCycle } from "@hooks/store"

import { CycleDetailsSidebar } from "./sidebar"

type Props = {
    projectId: string
    workspaceSlug: string
    isArchived?: boolean
}

export const CyclePeekOverview: React.FC<Props> = observer(({ projectId, isArchived, workspaceSlug }) => {
    const router = useRouter()
    const params = useSearchParams()
    const pathname = usePathname()
    const ref = React.useRef(null)
    const { fetchCycleDetails } = useCycle()

    const handleClose = () => {
        router.push(pathname)
    }

    useEffect(() => {
        if (!params.has("peekCycle") || isArchived) return
        fetchCycleDetails(workspaceSlug, projectId, params.get("peekCycle") as string)
    }, [fetchCycleDetails, params.get("peekCycle"), isArchived, projectId, workspaceSlug])

    return (
        <>
            {params.has("peekCycle") && (
                <div
                    ref={ref}
                    className="flex h-full w-full max-w-[24rem] flex-shrink-0 flex-col gap-3.5 overflow-y-auto border-l border-custom-border-100 bg-custom-sidebar-background-100 px-6 duration-300 fixed md:relative right-0 z-[9]"
                    style={{
                        boxShadow:
                            "0px 1px 4px 0px rgba(0, 0, 0, 0.06), 0px 2px 4px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px -1px rgba(16, 24, 40, 0.06)",
                    }}
                >
                    <CycleDetailsSidebar
                        cycleId={params.get("peekCycle") ?? ""}
                        handleClose={handleClose}
                        isArchived={isArchived}
                    />
                </div>
            )}
        </>
    )
})
