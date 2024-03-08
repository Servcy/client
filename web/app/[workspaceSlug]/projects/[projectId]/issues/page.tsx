"use client"

import Head from "next/head"
import { useRouter } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectIssuesHeader } from "@components/headers"
import { ProjectLayoutRoot } from "@components/issues"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

import type { NextPageWithWrapper } from "@servcy/types"

const ProjectIssuesPage: NextPageWithWrapper = observer(() => {
    const router = useRouter()
    const { projectId } = router.query
    // store
    const { getProjectById } = useProject()

    if (!projectId) {
        return <></>
    }

    // derived values
    const project = getProjectById(projectId.toString())
    const pageTitle = project?.name ? `${project?.name} - Issues` : undefined

    return (
        <AppWrapper header={<ProjectIssuesHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <Head>
                <title>{project?.name} - Issues</title>
            </Head>
            <div className="h-full w-full">
                <ProjectLayoutRoot />
            </div>
        </AppWrapper>
    )
})

ProjectIssuesPage.hasWrapper = true

export default ProjectIssuesPage
