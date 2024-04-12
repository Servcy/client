"use client"

import { useParams } from "next/navigation"

import { useCallback } from "react"

import { TModuleFilters } from "@plane/types"
import { calculateTotalFilters } from "helpers/filter.helper"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ModulesListHeader } from "@components/headers"
import { ModuleAppliedFiltersList, ModulesListView } from "@components/modules"

import { useModuleFilter, useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectModulesPage = observer(() => {
    const { projectId } = useParams()
    // store
    const { getProjectById } = useProject()
    // derived values
    const { currentProjectFilters, clearAllFilters, updateFilters } = useModuleFilter()
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Modules` : undefined
    const handleRemoveFilter = useCallback(
        (key: keyof TModuleFilters, value: string | null) => {
            if (!projectId) return
            let newValues = currentProjectFilters?.[key] ?? []

            if (!value) newValues = []
            else newValues = newValues.filter((val) => val !== value)

            updateFilters(projectId.toString(), { [key]: newValues })
        },
        [currentProjectFilters, projectId, updateFilters]
    )

    return (
        <AppWrapper header={<ModulesListHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="h-full w-full flex flex-col">
                {calculateTotalFilters(currentProjectFilters ?? {}) !== 0 && (
                    <div className="border-b border-custom-border-200 px-5 py-3">
                        <ModuleAppliedFiltersList
                            appliedFilters={currentProjectFilters ?? {}}
                            handleClearAllFilters={() => clearAllFilters(`${projectId}`)}
                            handleRemoveFilter={handleRemoveFilter}
                            alwaysAllowEditing
                        />
                    </div>
                )}
                <ModulesListView />
            </div>
        </AppWrapper>
    )
})

export default ProjectModulesPage
