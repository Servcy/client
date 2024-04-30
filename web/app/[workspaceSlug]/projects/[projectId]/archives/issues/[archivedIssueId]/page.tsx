"use client"

import { useParams, useRouter } from "next/navigation"

import { useState } from "react"

import { ArchiveRestoreIcon } from "lucide-react"
import { observer } from "mobx-react"
import toast from "react-hot-toast"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { ProjectArchivedIssueDetailsHeader } from "@components/headers"
import { IssueDetailRoot } from "@components/issues"

import { useIssueDetail, useIssues, useProject, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"
import { EIssuesStoreType } from "@constants/issue"

import { AppWrapper } from "@wrappers/app"

import { ArchiveIcon, Button, Loader } from "@servcy/ui"

const ArchivedIssueDetailsPage = observer(() => {
    const router = useRouter()
    const params = useParams()
    const { workspaceSlug, projectId, archivedIssueId } = params
    // states
    const [isRestoring, setIsRestoring] = useState(false)

    const {
        fetchIssue,
        issue: { getIssueById },
    } = useIssueDetail()
    const {
        issues: { restoreIssue },
    } = useIssues(EIssuesStoreType.ARCHIVED)

    const { getProjectById } = useProject()
    const {
        membership: { currentProjectRole },
    } = useUser()

    const { isLoading } = useSWR(
        workspaceSlug && projectId && archivedIssueId
            ? `ARCHIVED_ISSUE_DETAIL_${workspaceSlug}_${projectId}_${archivedIssueId}`
            : null,
        workspaceSlug && projectId && archivedIssueId
            ? () => fetchIssue(workspaceSlug.toString(), projectId.toString(), archivedIssueId.toString(), "ARCHIVED")
            : null
    )

    // derived values
    const issue = archivedIssueId ? getIssueById(archivedIssueId.toString()) : undefined
    const project = issue ? getProjectById(issue?.project_id) : undefined
    const pageTitle = project && issue ? `${project?.identifier}-${issue?.sequence_id} ${issue?.name}` : undefined
    // auth
    const canRestoreIssue = currentProjectRole !== undefined && currentProjectRole >= ERoles.MEMBER

    if (!issue) return <></>

    const handleRestore = async () => {
        if (!workspaceSlug || !projectId || !archivedIssueId) return

        setIsRestoring(true)

        await restoreIssue(workspaceSlug.toString(), projectId.toString(), archivedIssueId.toString())
            .then(() => {
                router.push(`/${workspaceSlug}/projects/${projectId}/issues/${archivedIssueId}`)
            })
            .catch(() => {
                toast.error("Please try again later")
            })
            .finally(() => setIsRestoring(false))
    }

    const issueLoader = !issue || isLoading ? true : false

    return (
        <AppWrapper header={<ProjectArchivedIssueDetailsHeader />} withProjectWrapper>
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
                <div className="flex h-full overflow-hidden">
                    <div className="h-full w-full space-y-3 divide-y-2 divide-custom-border-200 overflow-y-auto p-5">
                        {issue?.archived_at && canRestoreIssue && (
                            <div className="flex items-center justify-between gap-2 rounded-md border border-custom-border-200 bg-custom-background-90 px-2.5 py-2 text-sm text-custom-text-200">
                                <div className="flex items-center gap-2">
                                    <ArchiveIcon className="h-4 w-4" />
                                    <p>This issue has been archived.</p>
                                </div>
                                <Button
                                    className="flex items-center gap-1.5 rounded-md border border-custom-border-200 p-1.5 text-sm"
                                    onClick={handleRestore}
                                    disabled={isRestoring}
                                    variant="neutral-primary"
                                >
                                    <ArchiveRestoreIcon className="h-3.5 w-3.5" />
                                    <span>{isRestoring ? "Restoring" : "Restore"}</span>
                                </Button>
                            </div>
                        )}
                        {workspaceSlug && projectId && archivedIssueId && (
                            <IssueDetailRoot
                                workspaceSlug={workspaceSlug.toString()}
                                projectId={projectId.toString()}
                                issueId={archivedIssueId.toString()}
                                is_archived
                            />
                        )}
                    </div>
                </div>
            )}
        </AppWrapper>
    )
})

export default ArchivedIssueDetailsPage
