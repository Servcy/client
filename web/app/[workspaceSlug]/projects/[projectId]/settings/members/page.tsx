"use client"

import type { NextPageWithWrapper } from "@servcy/types"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectSettingHeader } from "@components/headers"
import { ProjectMemberList, ProjectSettingsMemberDefaults } from "@components/project"

import { useProject } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"
import { ProjectSettingLayout } from "@wrappers/settings"

const MembersSettingsPage: NextPageWithWrapper = observer(() => {
    // store
    const { currentProjectDetails } = useProject()
    // derived values
    const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails?.name} - Members` : undefined

    return (
        <AppWrapper header={<ProjectSettingHeader title="Members Settings" />} withProjectWrapper>
            <ProjectSettingLayout>
                <PageHead title={pageTitle} />
                <section className={`w-full overflow-y-auto py-8 pr-9`}>
                    <ProjectSettingsMemberDefaults />
                    <ProjectMemberList />
                </section>
            </ProjectSettingLayout>
        </AppWrapper>
    )
})

MembersSettingsPage.hasWrapper = true

export default MembersSettingsPage
