import { ReactElement } from "react"

import { NextPageWithLayout } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { WorkspaceSettingHeader } from "@components/headers"
import { WorkspaceDetails } from "@components/workspace"

import { useWorkspace } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"
import { WorkspaceSettingLayout } from "@layouts/settings-layout"

const WorkspaceSettingsPage: NextPageWithLayout = observer(() => {
    // store hooks
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - General Settings` : undefined

    return (
        <>
            <PageHead title={pageTitle} />
            <WorkspaceDetails />
        </>
    )
})

WorkspaceSettingsPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout header={<WorkspaceSettingHeader title="General Settings" />}>
            <WorkspaceSettingLayout>{page}</WorkspaceSettingLayout>
        </AppLayout>
    )
}

export default WorkspaceSettingsPage
