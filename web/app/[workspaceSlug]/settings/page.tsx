"use client"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { WorkspaceSettingHeader } from "@components/headers"
import { WorkspaceDetails } from "@components/workspace"

import { useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"
import { WorkspaceSettingWrapper } from "@wrappers/settings"

import type { NextPageWithWrapper } from "@servcy/types"

const WorkspaceSettingsPage: NextPageWithWrapper = observer(() => {
    // store hooks
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - General Settings` : undefined

    return (
        <AppWrapper header={<WorkspaceSettingHeader title="General Settings" />}>
            <WorkspaceSettingWrapper>
                <PageHead title={pageTitle} />
                <WorkspaceDetails />
            </WorkspaceSettingWrapper>
        </AppWrapper>
    )
})

export default WorkspaceSettingsPage
