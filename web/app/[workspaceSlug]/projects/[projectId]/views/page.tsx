"use client"

import { useRouter } from "next/router"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectViewsHeader } from "@components/headers"
import { ProjectViewsList } from "@components/views"

import { useProject } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

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
        <AppLayout header={<ProjectViewsHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <ProjectViewsList />
        </AppLayout>
    )
})

ProjectViewsPage.hasWrapper = true

export default ProjectViewsPage
