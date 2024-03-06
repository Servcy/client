"use client"

import { useRouter } from "next/router"

import { useState } from "react"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { ProjectSettingHeader } from "@components/headers"
import {
    DeleteProjectModal,
    DeleteProjectSection,
    ProjectDetailsForm,
    ProjectDetailsFormLoader,
} from "@components/project"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"
import { ProjectSettingLayout } from "@wrappers/settings"

const GeneralSettingsPage: NextPageWithWrapper = observer(() => {
    // states
    const [selectProject, setSelectedProject] = useState<string | null>(null)
    // router
    const router = useRouter()
    const { workspaceSlug, projectId } = router.query
    // store hooks
    const { currentProjectDetails, fetchProjectDetails } = useProject()
    // api call to fetch project details
    // TODO: removed this API if not necessary
    const { isLoading } = useSWR(
        workspaceSlug && projectId ? `PROJECT_DETAILS_${projectId}` : null,
        workspaceSlug && projectId ? () => fetchProjectDetails(workspaceSlug.toString(), projectId.toString()) : null
    )
    // derived values
    const isAdmin = currentProjectDetails?.member_role === 20
    const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails?.name} - General Settings` : undefined

    return (
        <AppWrapper header={<ProjectSettingHeader title="General Settings" />} withProjectWrapper>
            <ProjectSettingLayout>
                <PageHead title={pageTitle} />
                {currentProjectDetails && (
                    <DeleteProjectModal
                        project={currentProjectDetails}
                        isOpen={Boolean(selectProject)}
                        onClose={() => setSelectedProject(null)}
                    />
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
                        <DeleteProjectSection
                            projectDetails={currentProjectDetails}
                            handleDelete={() => setSelectedProject(currentProjectDetails.id ?? null)}
                        />
                    )}
                </div>
            </ProjectSettingLayout>
        </AppWrapper>
    )
})

GeneralSettingsPage.hasWrapper = true

export default GeneralSettingsPage
