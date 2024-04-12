import Image from "next/image"

import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import AllFiltersImage from "public/empty-state/project/all-filters.svg"
import NameFilterImage from "public/empty-state/project/name-filter.svg"

import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { ProjectCard } from "@components/project"
import { ProjectsLoader } from "@components/ui"

import { useApplication, useEventTracker, useProject, useProjectFilter, useUser } from "@hooks/store"

import { WORKSPACE_EMPTY_STATE_DETAILS } from "@constants/empty-state"
import { ERoles } from "@constants/iam"

export const ProjectCardList = observer(() => {
    const { resolvedTheme } = useTheme()
    const { commandPalette: commandPaletteStore } = useApplication()
    const { setTrackElement } = useEventTracker()
    const {
        membership: { currentWorkspaceRole },
        currentUser,
    } = useUser()
    const { workspaceProjectIds, filteredProjectIds, getProjectById } = useProject()
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const emptyStateImage = getEmptyStateImagePath("onboarding", "projects", isLightMode)
    const { searchQuery } = useProjectFilter()
    const isEditingAllowed = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.MEMBER

    if (!filteredProjectIds) return <ProjectsLoader />
    if (workspaceProjectIds?.length === 0)
        return (
            <EmptyState
                image={emptyStateImage}
                title={WORKSPACE_EMPTY_STATE_DETAILS["projects"].title}
                description={WORKSPACE_EMPTY_STATE_DETAILS["projects"].description}
                primaryButton={{
                    text: WORKSPACE_EMPTY_STATE_DETAILS["projects"].primaryButton.text,
                    onClick: () => {
                        setTrackElement("Project empty state")
                        commandPaletteStore.toggleCreateProjectModal(true)
                    },
                }}
                comicBox={{
                    title: WORKSPACE_EMPTY_STATE_DETAILS["projects"].comicBox.title,
                    description: WORKSPACE_EMPTY_STATE_DETAILS["projects"].comicBox.description,
                }}
                size="lg"
                disabled={!isEditingAllowed}
            />
        )
    if (filteredProjectIds.length === 0)
        return (
            <div className="h-full w-full grid place-items-center">
                <div className="text-center">
                    <Image
                        src={searchQuery.trim() === "" ? AllFiltersImage : NameFilterImage}
                        className="h-36 sm:h-48 w-36 sm:w-48 mx-auto"
                        alt="No matching projects"
                    />
                    <h5 className="text-xl font-medium mt-7 mb-1">No matching projects</h5>
                    <p className="text-custom-text-400 text-base whitespace-pre-line">
                        {searchQuery.trim() === ""
                            ? "Remove the filters to see all projects"
                            : "No projects detected with the matching\ncriteria. Create a new project instead"}
                    </p>
                </div>
            </div>
        )

    return (
        <div className="h-full w-full overflow-y-auto p-8 vertical-scrollbar scrollbar-lg">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjectIds.map((projectId) => {
                    const projectDetails = getProjectById(projectId)
                    if (!projectDetails) return
                    return <ProjectCard key={projectDetails.id} project={projectDetails} />
                })}
            </div>
        </div>
    )
})
