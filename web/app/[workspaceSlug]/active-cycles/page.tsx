"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { WorkspaceActiveCycleHeader } from "@components/headers"
import { WorkspaceActiveCyclesUpgrade } from "@components/workspace"

import { useWorkspace } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

const WorkspaceActiveCyclesPage: NextPageWithWrapper = observer(() => {
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Active Cycles` : undefined

    return (
        <AppLayout header={<WorkspaceActiveCycleHeader />}>
            <PageHead title={pageTitle} />
            <WorkspaceActiveCyclesUpgrade />
        </AppLayout>
    )
})

WorkspaceActiveCyclesPage.hasWrapper = true

export default WorkspaceActiveCyclesPage
