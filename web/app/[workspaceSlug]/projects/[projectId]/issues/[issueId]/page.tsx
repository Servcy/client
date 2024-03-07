"use client"

import { useRouter } from "next/router"

import { useEffect } from "react"

import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { ProjectIssueDetailsHeader } from "@components/headers"
import { IssueDetailRoot } from "@components/issues"

import { useApplication, useIssueDetail, useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

import type { NextPageWithWrapper } from "@servcy/types"
import { Loader } from "@servcy/ui"

const IssueDetailsPage: NextPageWithWrapper = observer(() => {
    // router
    const router = useRouter()
    const { workspaceSlug, projectId, issueId } = router.query

    const {
        fetchIssue,
        issue: { getIssueById },
    } = useIssueDetail()
    const { getProjectById } = useProject()
    const { theme: themeStore } = useApplication()
    // fetching issue details
    const { isLoading } = useSWR(
        workspaceSlug && projectId && issueId ? `ISSUE_DETAIL_${workspaceSlug}_${projectId}_${issueId}` : null,
        workspaceSlug && projectId && issueId
            ? () => fetchIssue(workspaceSlug.toString(), projectId.toString(), issueId.toString())
            : null
    )
    // derived values
    const issue = getIssueById(issueId?.toString() || "") || undefined
    const project = (issue?.project_id && getProjectById(issue?.project_id)) || undefined
    const issueLoader = !issue || isLoading ? true : false
    const pageTitle = project && issue ? `${project?.identifier}-${issue?.sequence_id} ${issue?.name}` : undefined

    useEffect(() => {
        const handleToggleIssueDetailSidebar = () => {
            if (window && window.innerWidth < 768) {
                themeStore.toggleIssueDetailSidebar(true)
            }
            if (window && themeStore.issueDetailSidebarCollapsed && window.innerWidth >= 768) {
                themeStore.toggleIssueDetailSidebar(false)
            }
        }

        window.addEventListener("resize", handleToggleIssueDetailSidebar)
        handleToggleIssueDetailSidebar()
        return () => window.removeEventListener("resize", handleToggleIssueDetailSidebar)
    }, [themeStore])

    return (
        <AppWrapper header={<ProjectIssueDetailsHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            {issueLoader ? (
                <Loader className="flex h-full gap-5 p-5">
                    <div className="basis-2/3 space-y-2">
                        <Loader.Item height="30px" width="40%" />
                        <Loader.Item height="15px" width="60%" />
                        <Loader.Item height="15px" width="60%" />
                        <Loader.Item height="15px" width="40%" />
                    </div>
                    <div className="basis-1/3 space-y-3">
                        <Loader.Item height="30px" />
                        <Loader.Item height="30px" />
                        <Loader.Item height="30px" />
                        <Loader.Item height="30px" />
                    </div>
                </Loader>
            ) : (
                workspaceSlug &&
                projectId &&
                issueId && (
                    <IssueDetailRoot
                        workspaceSlug={workspaceSlug.toString()}
                        projectId={projectId.toString()}
                        issueId={issueId.toString()}
                    />
                )
            )}
        </AppWrapper>
    )
})

IssueDetailsPage.hasWrapper = true

export default IssueDetailsPage
