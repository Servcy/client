"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectArchivesHeader } from "@components/headers"
import { ArchivedModuleLayoutRoot, ArchivedModulesHeader } from "@components/modules"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectArchivedModulesPage = observer(() => {
    const { projectId } = useParams()
    const { getProjectById } = useProject()
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name && `${project?.name} - Archived modules`

    return (
        <AppWrapper header={<ProjectArchivesHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="relative flex h-full w-full flex-col overflow-hidden">
                <ArchivedModulesHeader />
                <ArchivedModuleLayoutRoot />
            </div>
        </AppWrapper>
    )
})

export default ProjectArchivedModulesPage
