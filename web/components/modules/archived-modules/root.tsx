import { useRouter } from "next/router"

import React, { useCallback } from "react"

import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import useSWR from "swr"

// components
import { EmptyState, getEmptyStateImage } from "@components/empty-state"
import { ArchivedModulesView, ModuleAppliedFiltersList } from "@components/modules"
import { CycleModuleListLayout } from "@components/ui"

// hooks
import { useModule, useModuleFilter, useUser } from "@hooks/store"

// constants
import { MODULE_EMPTY_STATE_DETAILS } from "@constants/empty-state"

// helpers
import { calculateTotalFilters } from "@helpers/filter.helper"

// types
import { TModuleFilters } from "@servcy/types"

export const ArchivedModuleLayoutRoot: React.FC = observer(() => {
    // router
    const router = useRouter()
    const { workspaceSlug, projectId } = router.query
    // hooks
    const { currentUser } = useUser()
    const { fetchArchivedModules, projectArchivedModuleIds, loader } = useModule()
    const { resolvedTheme } = useTheme()
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    // module filters hook
    const { clearAllFilters, currentProjectArchivedFilters, updateFilters } = useModuleFilter()
    // derived values
    const totalArchivedModules = projectArchivedModuleIds?.length ?? 0
    const emptyStateProps = {
        title: MODULE_EMPTY_STATE_DETAILS.archived.title,
        description: MODULE_EMPTY_STATE_DETAILS.archived.description,
        image: getEmptyStateImage(MODULE_EMPTY_STATE_DETAILS.archived.path, isLightMode),
        disabled: false,
    }
    useSWR(
        workspaceSlug && projectId ? `ARCHIVED_MODULES_${workspaceSlug.toString()}_${projectId.toString()}` : null,
        async () => {
            if (workspaceSlug && projectId) {
                await fetchArchivedModules(workspaceSlug.toString(), projectId.toString())
            }
        },
        { revalidateIfStale: false, revalidateOnFocus: false }
    )

    const handleRemoveFilter = useCallback(
        (key: keyof TModuleFilters, value: string | null) => {
            if (!projectId) return
            let newValues = currentProjectArchivedFilters?.[key] ?? []

            if (!value) newValues = []
            else newValues = newValues.filter((val) => val !== value)

            updateFilters(projectId.toString(), { [key]: newValues }, "archived")
        },
        [currentProjectArchivedFilters, projectId, updateFilters]
    )

    if (!workspaceSlug || !projectId) return <></>

    if (loader || !projectArchivedModuleIds) {
        return <CycleModuleListLayout />
    }

    return (
        <>
            {calculateTotalFilters(currentProjectArchivedFilters ?? {}) !== 0 && (
                <div className="border-b border-custom-border-200 px-5 py-3">
                    <ModuleAppliedFiltersList
                        appliedFilters={currentProjectArchivedFilters ?? {}}
                        handleClearAllFilters={() => clearAllFilters(projectId.toString(), "archived")}
                        handleRemoveFilter={handleRemoveFilter}
                        alwaysAllowEditing
                    />
                </div>
            )}
            {totalArchivedModules === 0 ? (
                <div className="h-full place-items-center">
                    <EmptyState
                        title={emptyStateProps.title}
                        description={emptyStateProps.description}
                        image={emptyStateProps.image}
                        disabled={emptyStateProps.disabled}
                    />
                </div>
            ) : (
                <div className="relative h-full w-full overflow-auto">
                    <ArchivedModulesView workspaceSlug={workspaceSlug.toString()} projectId={projectId.toString()} />
                </div>
            )}
        </>
    )
})
