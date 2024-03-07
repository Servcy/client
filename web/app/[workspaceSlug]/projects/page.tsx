"use client"

import type { NextPageWithWrapper } from "@servcy/types"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectsHeader } from "@components/headers"
import { ProjectCardList } from "@components/project"

import { useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectsPage: NextPageWithWrapper = observer(() => {
    // store
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Projects` : undefined

    return (
        <AppWrapper header={<ProjectsHeader />}>
            <PageHead title={pageTitle} />
            <ProjectCardList />
        </AppWrapper>
    )
})

ProjectsPage.hasWrapper = true

export default ProjectsPage
