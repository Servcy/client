import { useParams, usePathname, useRouter } from "next/navigation"

import React, { useEffect } from "react"

import { observer } from "mobx-react-lite"

import { useCycle } from "@hooks/store"

import { CycleDetailsSidebar } from "./sidebar"

type Props = {
    projectId: string
    workspaceSlug: string
}

export const CyclePeekOverview: React.FC<Props> = observer(({ projectId, workspaceSlug }) => {
    // router
    const router = useRouter()
    const params = useParams()
    const pathname = usePathname()
    const { peekCycle } = params
    // refs
    const ref = React.useRef(null)
    // store hooks
    const { fetchCycleDetails } = useCycle()

    const handleClose = () => {
        delete params["peekCycle"]
        const searchParams: Record<string, string> = {}
        Object.keys(params).forEach((key: string) => {
            searchParams[key] = `${params[key]}`
        })
        const newPath = `${pathname}?${new URLSearchParams(searchParams).toString()}`
        router.push(newPath)
    }

    useEffect(() => {
        if (!peekCycle) return
        fetchCycleDetails(workspaceSlug, projectId, peekCycle.toString())
    }, [fetchCycleDetails, peekCycle, projectId, workspaceSlug])

    return (
        <>
            {peekCycle && (
                <div
                    ref={ref}
                    className="flex h-full w-full max-w-[24rem] flex-shrink-0 flex-col gap-3.5 overflow-y-auto border-l border-custom-border-100 bg-custom-sidebar-background-100 px-6 py-3.5 duration-300 fixed md:relative right-0 z-[9]"
                    style={{
                        boxShadow:
                            "0px 1px 4px 0px rgba(0, 0, 0, 0.06), 0px 2px 4px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px -1px rgba(16, 24, 40, 0.06)",
                    }}
                >
                    <CycleDetailsSidebar cycleId={peekCycle?.toString() ?? ""} handleClose={handleClose} />
                </div>
            )}
        </>
    )
})
