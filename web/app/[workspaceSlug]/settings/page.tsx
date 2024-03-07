"use client"

import type { NextPageWithWrapper } from "@servcy/types"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { WorkspaceSettingHeader } from "@components/headers"
import { WorkspaceDetails } from "@components/workspace"

import { useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"
import { WorkspaceSettingLayout } from "@wrappers/settings"

const WorkspaceSettingsPage: NextPageWithWrapper = observer(() => {
    // store hooks
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - General Settings` : undefined

    return (
        <AppWrapper header={<WorkspaceSettingHeader title="General Settings" />}>
            <WorkspaceSettingLayout>
                <PageHead title={pageTitle} />
                <WorkspaceDetails />
            </WorkspaceSettingLayout>
        </AppWrapper>
    )
})

WorkspaceSettingsPage.hasWrapper = true

export default WorkspaceSettingsPage
