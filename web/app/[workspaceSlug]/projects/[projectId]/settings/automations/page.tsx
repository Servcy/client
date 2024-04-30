"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { AutoArchiveAutomation, AutoCloseAutomation } from "@components/automation"
import { PageHead } from "@components/core"
import { ProjectSettingHeader } from "@components/headers"

import { useProject, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"
import { ProjectSettingLayout } from "@wrappers/settings"

import type { IProject } from "@servcy/types"

const AutomationSettingsPage = observer(() => {
    const { workspaceSlug, projectId } = useParams()

    // store hooks
    const {
        membership: { currentProjectRole },
    } = useUser()
    const { currentProjectDetails: projectDetails, updateProject } = useProject()

    const handleChange = async (formData: Partial<IProject>) => {
        if (!workspaceSlug || !projectId || !projectDetails) return

        await updateProject(workspaceSlug.toString(), projectId.toString(), formData).catch(() => {
            toast.error("Please try again later")
        })
    }

    // derived values
    const isAdmin = currentProjectRole !== undefined && currentProjectRole >= ERoles.ADMIN
    const pageTitle = projectDetails?.name ? `${projectDetails?.name} - Automations` : undefined

    return (
        <AppWrapper header={<ProjectSettingHeader title="Automations Settings" />} withProjectWrapper>
            <ProjectSettingLayout>
                <PageHead title={pageTitle} />
                <section className={`w-full overflow-y-auto py-8 pr-9 ${isAdmin ? "" : "opacity-60"}`}>
                    <div className="flex items-center border-b border-custom-border-100 py-3.5">
                        <h3 className="text-xl font-medium">Automations</h3>
                    </div>
                    <AutoArchiveAutomation handleChange={handleChange} />
                    <AutoCloseAutomation handleChange={handleChange} />
                </section>
            </ProjectSettingLayout>
        </AppWrapper>
    )
})

export default AutomationSettingsPage
