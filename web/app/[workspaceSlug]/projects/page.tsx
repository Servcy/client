"use client"

import { useCallback } from "react"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectsHeader } from "@components/headers"
import { ProjectAppliedFiltersList, ProjectCardList } from "@components/project"

import { useApplication, useProject, useProjectFilter, useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

import { calculateTotalFilters } from "@helpers/filter.helper"

import { TProjectAppliedDisplayFilterKeys, TProjectFilters } from "@servcy/types"

const ProjectsPage = observer(() => {
    const { currentWorkspace } = useWorkspace()
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Projects` : undefined

    const {
        router: { workspaceSlug },
    } = useApplication()
    const { totalProjectIds, filteredProjectIds } = useProject()
    const {
        currentWorkspaceFilters,
        currentWorkspaceAppliedDisplayFilters,
        clearAllFilters,
        clearAllAppliedDisplayFilters,
        updateFilters,
        updateDisplayFilters,
    } = useProjectFilter()

    const handleRemoveDisplayFilter = useCallback(
        (key: TProjectAppliedDisplayFilterKeys) => {
            if (!workspaceSlug) return
            updateDisplayFilters(workspaceSlug.toString(), { [key]: false })
        },
        [updateDisplayFilters, workspaceSlug]
    )

    const handleClearAllFilters = useCallback(() => {
        if (!workspaceSlug) return
        clearAllFilters(workspaceSlug.toString())
        clearAllAppliedDisplayFilters(workspaceSlug.toString())
    }, [clearAllFilters, clearAllAppliedDisplayFilters, workspaceSlug])

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
                {(calculateTotalFilters(currentWorkspaceFilters ?? {}) !== 0 ||
                    currentWorkspaceAppliedDisplayFilters?.length !== 0) && (
                    <div className="border-b border-custom-border-200 px-5 py-3">
                        <ProjectAppliedFiltersList
                            appliedFilters={currentWorkspaceFilters ?? {}}
                            appliedDisplayFilters={currentWorkspaceAppliedDisplayFilters ?? []}
                            handleClearAllFilters={handleClearAllFilters}
                            handleRemoveFilter={handleRemoveFilter}
                            handleRemoveDisplayFilter={handleRemoveDisplayFilter}
                            filteredProjects={filteredProjectIds?.length ?? 0}
                            totalProjects={totalProjectIds?.length ?? 0}
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
