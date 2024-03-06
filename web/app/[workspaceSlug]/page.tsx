"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { WorkspaceDashboardHeader } from "@components/headers/workspace-dashboard"
import { WorkspaceDashboardView } from "@components/page-views"

import { useWorkspace } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

const WorkspacePage: NextPageWithWrapper = observer(() => {
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined

    return (
        <AppLayout header={<WorkspaceDashboardHeader />}>
            <PageHead title={pageTitle} />
            <WorkspaceDashboardView />
        </AppLayout>
    )
})

WorkspacePage.hasWrapper = true

export default WorkspacePage
