"use client"

import { useParams } from "next/navigation"

import { useState } from "react"

import useSWR from "swr"

import { ProjectMemberList } from "@components/project"

import { useTimeTracker } from "@hooks/store"

import { IMemberWiseTimesheetDuration } from "@servcy/types"

export const ProjectCostAnalysisRoot = () => {
    const { projectId, workspaceSlug } = useParams()
    const { fetchProjectMemberWiseTimeLogged } = useTimeTracker()
    const [projectExpense, setProjectExpense] = useState<number>(0)

    useSWR(
        workspaceSlug && projectId
            ? `PROJECT_MEMBER_WISE_TIME_LOGGED_${workspaceSlug.toString()}_${projectId.toString()}`
            : null,
        workspaceSlug && projectId
            ? () => fetchProjectMemberWiseTimeLogged(workspaceSlug.toString(), projectId.toString())
            : null
    )

    return (
        <div className="h-full w-full">
            <ProjectMemberList disableLeave={true} disableAddMember={true} title="Members Cost" />
        </div>
    )
}
