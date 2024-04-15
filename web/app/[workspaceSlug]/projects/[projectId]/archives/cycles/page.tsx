"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ArchivedCycleLayoutRoot, ArchivedCyclesHeader } from "@components/cycles"
import { ProjectArchivesHeader } from "@components/headers"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectArchivedCyclesPage = observer(() => {
    const { projectId } = useParams()
    const { getProjectById } = useProject()
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name && `${project?.name} - Archived cycles`

    return (
        <AppWrapper header={<ProjectArchivesHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="relative flex h-full w-full flex-col overflow-hidden">
                <ArchivedCyclesHeader />
                <ArchivedCycleLayoutRoot />
            </div>
        </AppWrapper>
    )
})

export default ProjectArchivedCyclesPage
