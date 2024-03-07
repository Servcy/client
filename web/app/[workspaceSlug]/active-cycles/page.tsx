"use client"

import type { NextPageWithWrapper } from "@servcy/types"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { WorkspaceActiveCycleHeader } from "@components/headers"
import { WorkspaceActiveCyclesUpgrade } from "@components/workspace"

import { useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const WorkspaceActiveCyclesPage: NextPageWithWrapper = observer(() => {
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Active Cycles` : undefined

    return (
        <AppWrapper header={<WorkspaceActiveCycleHeader />}>
            <PageHead title={pageTitle} />
            <WorkspaceActiveCyclesUpgrade />
        </AppWrapper>
    )
})

WorkspaceActiveCyclesPage.hasWrapper = true

export default WorkspaceActiveCyclesPage
