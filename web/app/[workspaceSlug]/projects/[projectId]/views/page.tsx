"use client"

import { useRouter } from "next/router"

import { ReactElement } from "react"

import { NextPageWithLayout } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectViewsHeader } from "@components/headers"
import { ProjectViewsList } from "@components/views"

import { useProject } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

const ProjectViewsPage: NextPageWithLayout = observer(() => {
    // router
    const router = useRouter()
    const { projectId } = router.query
    // store
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Views` : undefined

    return (
        <>
            <PageHead title={pageTitle} />
            <ProjectViewsList />
        </>
    )
})

ProjectViewsPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout header={<ProjectViewsHeader />} withProjectWrapper>
            {page}
        </AppLayout>
    )
}

export default ProjectViewsPage
