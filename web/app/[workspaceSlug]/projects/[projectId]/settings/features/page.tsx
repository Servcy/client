"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { ProjectSettingHeader } from "@components/headers"
import { ProjectFeaturesList } from "@components/project"

import { useProject, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"
import { ProjectSettingLayout } from "@wrappers/settings"

import type { NextPageWithWrapper } from "@servcy/types"

const FeaturesSettingsPage: NextPageWithWrapper = observer(() => {
    const { workspaceSlug, projectId } = useParams()
    // store
    const {
        membership: { fetchUserProjectInfo },
    } = useUser()
    const { currentProjectDetails } = useProject()
    // fetch the project details
    const { data: memberDetails } = useSWR(
        workspaceSlug && projectId ? `PROJECT_MEMBERS_ME_${workspaceSlug}_${projectId}` : null,
        workspaceSlug && projectId ? () => fetchUserProjectInfo(workspaceSlug.toString(), projectId.toString()) : null
    )
    // derived values
    const isAdmin = (memberDetails?.role ?? 0) >= ERoles.ADMIN
    const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails?.name} - Features` : undefined

    return (
        <AppWrapper header={<ProjectSettingHeader title="Features Settings" />} withProjectWrapper>
            <ProjectSettingLayout>
                <PageHead title={pageTitle} />
                <section className={`w-full overflow-y-auto py-8 pr-9 ${isAdmin ? "" : "opacity-60"}`}>
                    <div className="flex items-center border-b border-custom-border-100 py-3.5">
                        <h3 className="text-xl font-medium">Features</h3>
                    </div>
                    <ProjectFeaturesList />
                </section>
            </ProjectSettingLayout>
        </AppWrapper>
    )
})

export default FeaturesSettingsPage
