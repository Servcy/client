"use client"

import { useParams } from "next/navigation"

import { PageHead } from "@components/core"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const ProjectCostAnalysis = () => {
    const { projectId } = useParams()
    const { getProjectById } = useProject()
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Cost Analysis` : undefined
    return (
        <AppWrapper header={<div />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="h-full w-full flex flex-col" />
        </AppWrapper>
    )
}

export default ProjectCostAnalysis
