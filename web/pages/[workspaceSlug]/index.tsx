import { ReactElement } from "react"
import { PageHead } from "@components/core"
import { WorkspaceDashboardHeader } from "@components/headers/workspace-dashboard"
import { WorkspaceDashboardView } from "@components/page-views"
import { useWorkspace } from "@hooks/store"
import { AppLayout } from "@layouts/app-layout"
import { observer } from "mobx-react"
import { NextPageWithLayout } from "@/types/types"

const WorkspacePage: NextPageWithLayout = observer(() => {
    const { currentWorkspace } = useWorkspace()
    // derived values
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Dashboard` : undefined

    return (
        <>
            <PageHead title={pageTitle} />
            <WorkspaceDashboardView />
        </>
    )
})

WorkspacePage.getWrapper = function getWrapper(page: ReactElement) {
    return <AppLayout header={<WorkspaceDashboardHeader />}>{page}</AppLayout>
}

export default WorkspacePage
