"use client"

import { useRouter } from "next/router"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectArchivedIssuesHeader } from "@components/headers"
import { ArchivedIssueLayoutRoot } from "@components/issues"

import { useProject } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

const ProjectArchivedIssuesPage: NextPageWithWrapper = observer(() => {
    // router
    const router = useRouter()
    const { projectId } = router.query
    // store hooks
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name && `${project?.name} - Archived issues`

    return (
        <AppLayout header={<ProjectArchivedIssuesHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <ArchivedIssueLayoutRoot />
        </AppLayout>
    )
})

ProjectArchivedIssuesPage.hasWrapper = true

export default ProjectArchivedIssuesPage
