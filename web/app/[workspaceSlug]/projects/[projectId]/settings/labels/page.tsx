"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectSettingHeader } from "@components/headers"
import { ProjectSettingsLabelList } from "@components/labels"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"
import { ProjectSettingLayout } from "@wrappers/settings"

const LabelsSettingsPage: NextPageWithWrapper = observer(() => {
    const { currentProjectDetails } = useProject()
    const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails?.name} - Labels` : undefined

    return (
        <AppWrapper withProjectWrapper header={<ProjectSettingHeader title="Labels Settings" />}>
            <ProjectSettingLayout>
                <PageHead title={pageTitle} />
                <div className="h-full w-full gap-10 overflow-y-auto py-8 pr-9">
                    <ProjectSettingsLabelList />
                </div>
            </ProjectSettingLayout>
        </AppWrapper>
    )
})

LabelsSettingsPage.hasWrapper = true

export default LabelsSettingsPage
