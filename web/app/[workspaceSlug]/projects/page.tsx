"use client"

import { useCallback } from "react"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectsHeader } from "@components/headers"
import { ProjectAppliedFiltersList, ProjectCardList } from "@components/project"

import { useApplication, useProject, useProjectFilter, useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

import { calculateTotalFilters } from "@helpers/filter.helper"

import { TProjectFilters } from "@servcy/types"

const ProjectsPage = observer(() => {
    const { currentWorkspace } = useWorkspace()
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Projects` : undefined

    const {
        router: { workspaceSlug },
    } = useApplication()
    const { workspaceProjectIds, filteredProjectIds } = useProject()
    const { currentWorkspaceFilters, clearAllFilters, updateFilters } = useProjectFilter()

    const handleRemoveFilter = useCallback(
        (key: keyof TProjectFilters, value: string | null) => {
            if (!workspaceSlug) return
            let newValues = currentWorkspaceFilters?.[key] ?? []

            if (!value) newValues = []
            else newValues = newValues.filter((val: any) => val !== value)

            updateFilters(workspaceSlug.toString(), { [key]: newValues })
        },
        [currentWorkspaceFilters, updateFilters, workspaceSlug]
    )
    return (
        <AppWrapper header={<ProjectsHeader />}>
            <PageHead title={pageTitle} />

            <div className="h-full w-full flex flex-col">
                {calculateTotalFilters(currentWorkspaceFilters ?? {}) !== 0 && (
                    <div className="border-b border-custom-border-200 px-5 py-3">
                        <ProjectAppliedFiltersList
                            appliedFilters={currentWorkspaceFilters ?? {}}
                            handleClearAllFilters={() => clearAllFilters(`${workspaceSlug}`)}
                            handleRemoveFilter={handleRemoveFilter}
                            filteredProjects={filteredProjectIds?.length ?? 0}
                            totalProjects={workspaceProjectIds?.length ?? 0}
                            alwaysAllowEditing
                        />
                    </div>
                )}
                <ProjectCardList />
            </div>
        </AppWrapper>
    )
})

export default ProjectsPage
