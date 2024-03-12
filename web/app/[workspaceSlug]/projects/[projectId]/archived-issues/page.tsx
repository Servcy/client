"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectArchivedIssuesHeader } from "@components/headers"
import { ArchivedIssueLayoutRoot } from "@components/issues"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectArchivedIssuesPage = observer(() => {
    const params = useParams()
    const { projectId } = params
    // store hooks
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name && `${project?.name} - Archived issues`

    return (
        <AppWrapper header={<ProjectArchivedIssuesHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <ArchivedIssueLayoutRoot />
        </AppWrapper>
    )
})

export default ProjectArchivedIssuesPage
