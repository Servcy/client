"use client"

import { useParams, useRouter } from "next/navigation"

import { observer } from "mobx-react"
import emptyCycle from "public/empty-state/cycle.svg"
import useSWR from "swr"

import { EmptyState } from "@components/common"
import { PageHead } from "@components/core"
import { CycleDetailsSidebar } from "@components/cycles"
import { CycleIssuesHeader } from "@components/headers"
import { CycleLayoutRoot } from "@components/issues/issue-layouts"

import { useCycle, useProject } from "@hooks/store"
import useLocalStorage from "@hooks/use-local-storage"

import { AppWrapper } from "@wrappers/app"

import type { NextPageWithWrapper } from "@servcy/types"

const CycleDetailPage: NextPageWithWrapper = observer(() => {

    const router = useRouter()
    const { workspaceSlug, projectId, cycleId } = useParams()
    // store hooks
    const { fetchCycleDetails, getCycleById } = useCycle()
    const { getProjectById } = useProject()

    const { setValue, storedValue } = useLocalStorage("cycle_sidebar_collapsed", "false")
    // fetching cycle details
    const { error } = useSWR(
        workspaceSlug && projectId && cycleId ? `CYCLE_DETAILS_${cycleId.toString()}` : null,
        workspaceSlug && projectId && cycleId
            ? () => fetchCycleDetails(workspaceSlug.toString(), projectId.toString(), cycleId.toString())
            : null
    )
    // derived values
    const isSidebarCollapsed = storedValue ? (storedValue === "true" ? true : false) : false
    const cycle = cycleId ? getCycleById(cycleId.toString()) : undefined
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name && cycle?.name ? `${project?.name} - ${cycle?.name}` : undefined

    /**
     * Toggles the sidebar
     */
    const toggleSidebar = () => setValue(`${!isSidebarCollapsed}`)

    return (
        <AppWrapper header={<CycleIssuesHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            {error ? (
                <EmptyState
                    image={emptyCycle}
                    title="Cycle does not exist"
                    description="The cycle you are looking for does not exist or has been deleted."
                    primaryButton={{
                        text: "View other cycles",
                        onClick: () => router.push(`/${workspaceSlug}/projects/${projectId}/cycles`),
                    }}
                />
            ) : (
                <>
                    <div className="flex h-full w-full">
                        <div className="h-full w-full overflow-hidden">
                            <CycleLayoutRoot />
                        </div>
                        {cycleId && !isSidebarCollapsed && (
                            <div
                                className="flex h-full w-[24rem] flex-shrink-0 flex-col gap-3.5 overflow-y-auto border-l border-custom-border-100 bg-custom-sidebar-background-100 px-6 py-3.5 duration-300 vertical-scrollbar scrollbar-sm"
                                style={{
                                    boxShadow:
                                        "0px 1px 4px 0px rgba(0, 0, 0, 0.06), 0px 2px 4px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px -1px rgba(16, 24, 40, 0.06)",
                                }}
                            >
                                <CycleDetailsSidebar cycleId={cycleId.toString()} handleClose={toggleSidebar} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </AppWrapper>
    )
})

CycleDetailPage.hasWrapper = true

export default CycleDetailPage
