"use client"

import { useRouter } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectViewsHeader } from "@components/headers"
import { ProjectViewsList } from "@components/views"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

import type { NextPageWithWrapper } from "@servcy/types"

const ProjectViewsPage: NextPageWithWrapper = observer(() => {
    // router
    const router = useRouter()
    const { projectId } = router.query
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

ProjectViewsPage.hasWrapper = true

export default ProjectViewsPage
