import { useRouter } from "next/router"

import React from "react"

import { observer } from "mobx-react-lite"
// components
import { useTheme } from "next-themes"
import useSWR from "swr"

import { ArchivedCyclesView, CycleAppliedFiltersList } from "@components/cycles"
import { EmptyState, getEmptyStateImage } from "@components/empty-state"
import { CycleModuleListLayout } from "@components/ui"

// hooks
import { useCycle, useCycleFilter, useUser } from "@hooks/store"

// constants
import { CYCLE_EMPTY_STATE_DETAILS } from "@constants/empty-state"

// helpers
import { calculateTotalFilters } from "@helpers/filter.helper"

// types
import { TCycleFilters } from "@servcy/types"

export const ArchivedCycleLayoutRoot: React.FC = observer(() => {
    // router
    const router = useRouter()
    const { workspaceSlug, projectId } = router.query
    const { currentUser } = useUser()
    // hooks
    const { fetchArchivedCycles, currentProjectArchivedCycleIds, loader } = useCycle()
    // cycle filters hook
    const { clearAllFilters, currentProjectArchivedFilters, updateFilters } = useCycleFilter()
    // derived values
    const { resolvedTheme } = useTheme()
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const totalArchivedCycles = currentProjectArchivedCycleIds?.length ?? 0

    useSWR(
        workspaceSlug && projectId ? `ARCHIVED_CYCLES_${workspaceSlug.toString()}_${projectId.toString()}` : null,
        async () => {
            if (workspaceSlug && projectId) {
                await fetchArchivedCycles(workspaceSlug.toString(), projectId.toString())
            }
        },
        { revalidateIfStale: false, revalidateOnFocus: false }
    )

    const handleRemoveFilter = (key: keyof TCycleFilters, value: string | null) => {
        if (!projectId) return
        let newValues = currentProjectArchivedFilters?.[key] ?? []

        if (!value) newValues = []
        else newValues = newValues.filter((val) => val !== value)

        updateFilters(projectId.toString(), { [key]: newValues }, "archived")
    }

    if (!workspaceSlug || !projectId) return <></>

    if (loader || !currentProjectArchivedCycleIds) {
        return <CycleModuleListLayout />
    }

    return (
        <>
            {calculateTotalFilters(currentProjectArchivedFilters ?? {}) !== 0 && (
                <div className="border-b border-custom-border-200 px-5 py-3">
                    <CycleAppliedFiltersList
                        appliedFilters={currentProjectArchivedFilters ?? {}}
                        handleClearAllFilters={() => clearAllFilters(projectId.toString(), "archived")}
                        handleRemoveFilter={handleRemoveFilter}
                    />
                </div>
            )}
            {totalArchivedCycles === 0 ? (
                <div className="h-full place-items-center">
                    <EmptyState
                        title={CYCLE_EMPTY_STATE_DETAILS.archived.title}
                        description={CYCLE_EMPTY_STATE_DETAILS.archived.description}
                        image={getEmptyStateImage(CYCLE_EMPTY_STATE_DETAILS.archived.path, isLightMode)}
                    />
                </div>
            ) : (
                <div className="relative h-full w-full overflow-auto">
                    <ArchivedCyclesView workspaceSlug={workspaceSlug.toString()} projectId={projectId.toString()} />
                </div>
            )}
        </>
    )
})
