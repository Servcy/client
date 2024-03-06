"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { WorkspaceSettingHeader } from "@components/headers"
import { WorkspaceDetails } from "@components/workspace"

import { useWorkspace } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

import { WorkspaceSettingLayout } from "@wrappers/settings"

const WorkspaceSettingsPage: NextPageWithWrapper = observer(() => {
    // store hooks
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - General Settings` : undefined

    return (
        <AppLayout header={<WorkspaceSettingHeader title="General Settings" />}>
            <WorkspaceSettingLayout>
                <PageHead title={pageTitle} />
                <WorkspaceDetails />
            </WorkspaceSettingLayout>
        </AppLayout>
    )
})

WorkspaceSettingsPage.hasWrapper = true

export default WorkspaceSettingsPage
