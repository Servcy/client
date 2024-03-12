"use client"

import { useParams, useRouter } from "next/navigation"

import { PenSquare, X } from "lucide-react"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectDraftIssueHeader } from "@components/headers"
import { DraftIssueLayoutRoot } from "@components/issues/issue-layouts/roots/draft-issue-layout-root"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectDraftIssuesPage = observer(() => {
    const router = useRouter()
    const params = useParams()
    const { workspaceSlug, projectId } = params
    // store
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Draft Issues` : undefined

    return (
        <AppWrapper header={<ProjectDraftIssueHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="flex h-full w-full flex-col">
                <div className="gap-1 flex items-center border-b border-custom-border-200 px-4 py-2.5 shadow-sm">
                    <button
                        type="button"
                        onClick={() => router.push(`/${workspaceSlug}/projects/${projectId}/issues/`)}
                        className="flex items-center gap-1.5 rounded-full border border-custom-border-200 px-3 py-1.5 text-xs"
                    >
                        <PenSquare className="h-4 w-4" />
                        <span>Draft Issues</span>
                        <X className="h-3 w-3" />
                    </button>
                </div>
                <DraftIssueLayoutRoot />
            </div>
        </AppWrapper>
    )
})

export default ProjectDraftIssuesPage
