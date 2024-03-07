"use client"

import { useRouter } from "next/router"

import type { NextPageWithWrapper } from "@servcy/types"
import { observer } from "mobx-react"
import emptyView from "public/empty-state/view.svg"
import useSWR from "swr"

import { EmptyState } from "@components/common"
import { PageHead } from "@components/core"
import { ProjectViewIssuesHeader } from "@components/headers"
import { ProjectViewLayoutRoot } from "@components/issues"

import { useProject, useProjectView } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectViewIssuesPage: NextPageWithWrapper = observer(() => {
    // router
    const router = useRouter()
    const { workspaceSlug, projectId, viewId } = router.query
    // store hooks
    const { fetchViewDetails, getViewById } = useProjectView()
    const { getProjectById } = useProject()
    // derived values
    const projectView = viewId ? getViewById(viewId.toString()) : undefined
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name && projectView?.name ? `${project?.name} - ${projectView?.name}` : undefined

    const { error } = useSWR(
        workspaceSlug && projectId && viewId ? `VIEW_DETAILS_${viewId.toString()}` : null,
        workspaceSlug && projectId && viewId
            ? () => fetchViewDetails(workspaceSlug.toString(), projectId.toString(), viewId.toString())
            : null
    )

    return (
        <AppWrapper header={<ProjectViewIssuesHeader />} withProjectWrapper>
            {error ? (
                <EmptyState
                    image={emptyView}
                    title="View does not exist"
                    description="The view you are looking for does not exist or has been deleted."
                    primaryButton={{
                        text: "View other views",
                        onClick: () => router.push(`/${workspaceSlug}/projects/${projectId}/views`),
                    }}
                />
            ) : (
                <>
                    <PageHead title={pageTitle} />
                    <ProjectViewLayoutRoot />
                </>
            )}
        </AppWrapper>
    )
})

ProjectViewIssuesPage.hasWrapper = true

export default ProjectViewIssuesPage
