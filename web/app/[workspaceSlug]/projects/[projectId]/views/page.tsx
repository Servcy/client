"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectViewsHeader } from "@components/headers"
import { ProjectViewsList } from "@components/views"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectViewsPage = observer(() => {
    const { projectId } = useParams()
    // store
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Views` : undefined

    return (
        <AppWrapper header={<ProjectViewsHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <ProjectViewsList />
        </AppWrapper>
    )
})

export default ProjectViewsPage
