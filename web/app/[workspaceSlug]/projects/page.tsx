"use client"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectsHeader } from "@components/headers"
import { ProjectCardList } from "@components/project"

import { useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

import type { NextPageWithWrapper } from "@servcy/types"

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

export default ProjectsPage
