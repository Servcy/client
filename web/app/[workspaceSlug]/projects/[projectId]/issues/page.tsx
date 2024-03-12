"use client"

import Head from "next/head"
import { useParams } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectIssuesHeader } from "@components/headers"
import { ProjectLayoutRoot } from "@components/issues"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectIssuesPage = observer(() => {
    const params = useParams()
    const { projectId } = params
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

export default ProjectIssuesPage
