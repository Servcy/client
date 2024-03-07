"use client"

import { useRouter } from "next/router"

import type { NextPageWithWrapper } from "@servcy/types"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ModulesListHeader } from "@components/headers"
import { ModulesListView } from "@components/modules"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectModulesPage: NextPageWithWrapper = observer(() => {
    const router = useRouter()
    const { projectId } = router.query
    // store
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Modules` : undefined

    return (
        <AppWrapper header={<ModulesListHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <ModulesListView />
        </AppWrapper>
    )
})

ProjectModulesPage.hasWrapper = true

export default ProjectModulesPage
