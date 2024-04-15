"use client"

import { useParams } from "next/navigation"

import { useState } from "react"

import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { ProjectSettingHeader } from "@components/headers"
import {
    ArchiveProjectSelection,
    ArchiveRestoreProjectModal,
    DeleteProjectModal,
    DeleteProjectSection,
    ProjectDetailsForm,
    ProjectDetailsFormLoader,
} from "@components/project"

import { useProject } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"
import { ProjectSettingLayout } from "@wrappers/settings"

import type { IProject } from "@servcy/types"

const GeneralSettingsPage = observer(() => {
    const [selectProject, setSelectedProject] = useState<string | null>(null)
    const { workspaceSlug, projectId } = useParams()
    const { currentProjectDetails, fetchProjectDetails } = useProject()
    const [archiveProject, setArchiveProject] = useState<boolean>(false)
    const { isLoading } = useSWR(
        workspaceSlug && projectId ? `PROJECT_DETAILS_${projectId}` : null,
        workspaceSlug && projectId ? () => fetchProjectDetails(workspaceSlug.toString(), projectId.toString()) : null
    )
    // derived values
    const isAdmin = (currentProjectDetails?.member_role ?? 0) >= ERoles.ADMIN
    const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails?.name} - General Settings` : undefined

    return (
        <AppWrapper header={<ProjectSettingHeader title="General Settings" />} withProjectWrapper>
            <ProjectSettingLayout>
                <PageHead title={pageTitle} />
                {currentProjectDetails && workspaceSlug && projectId && (
                    <>
                        <ArchiveRestoreProjectModal
                            workspaceSlug={workspaceSlug.toString()}
                            projectId={projectId.toString()}
                            isOpen={archiveProject}
                            onClose={() => setArchiveProject(false)}
                            archive
                        />
                        <DeleteProjectModal
                            project={currentProjectDetails}
                            isOpen={Boolean(selectProject)}
                            onClose={() => setSelectedProject(null)}
                        />
                    </>
                )}

                <div className={`w-full overflow-y-auto py-8 pr-9 ${isAdmin ? "" : "opacity-60"}`}>
                    {currentProjectDetails && workspaceSlug && projectId && !isLoading ? (
                        <ProjectDetailsForm
                            project={currentProjectDetails}
                            workspaceSlug={workspaceSlug.toString()}
                            projectId={projectId.toString()}
                            isAdmin={isAdmin}
                        />
                    ) : (
                        <ProjectDetailsFormLoader />
                    )}

                    {isAdmin && (
                        <>
                            <ArchiveProjectSelection
                                projectDetails={currentProjectDetails as IProject}
                                handleArchive={() => setArchiveProject(true)}
                            />
                            <DeleteProjectSection
                                projectDetails={currentProjectDetails as IProject}
                                handleDelete={() => setSelectedProject(currentProjectDetails?.id ?? null)}
                            />
                        </>
                    )}
                </div>
            </ProjectSettingLayout>
        </AppWrapper>
    )
})

export default GeneralSettingsPage
