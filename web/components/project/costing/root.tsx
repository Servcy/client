"use client"

import { useParams } from "next/navigation"

import useSWR from "swr"

import { useTimeTracker } from "@hooks/store"

import { MemberCostList } from "./member-cost-list"

export const ProjectCostAnalysisRoot = () => {
    const { projectId, workspaceSlug } = useParams()
    const { fetchProjectMemberWiseTimeLogged } = useTimeTracker()

    const {} = useSWR(
        workspaceSlug && projectId
            ? `PROJECT_MEMBER_WISE_TIME_LOGGED_${workspaceSlug.toString()}_${projectId.toString()}`
            : null,
        workspaceSlug && projectId
            ? () => fetchProjectMemberWiseTimeLogged(workspaceSlug.toString(), projectId.toString())
            : null
    )

    return (
        <div className="h-full w-full">
            <MemberCostList />
        </div>
    )
}
