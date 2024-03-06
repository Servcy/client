"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectsHeader } from "@components/headers"
import { ProjectCardList } from "@components/project"

import { useWorkspace } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

const ProjectsPage: NextPageWithWrapper = observer(() => {
    // store
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Projects` : undefined

    return (
        <AppLayout header={<ProjectsHeader />}>
            <PageHead title={pageTitle} />
            <ProjectCardList />
        </AppLayout>
    )
})

ProjectsPage.hasWrapper = true

export default ProjectsPage
