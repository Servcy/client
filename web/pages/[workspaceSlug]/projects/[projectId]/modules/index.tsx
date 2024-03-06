import { useRouter } from "next/router"
import { ReactElement } from "react"
import { PageHead } from "@components/core"
import { ModulesListHeader } from "@components/headers"
import { ModulesListView } from "@components/modules"
import { useProject } from "@hooks/store"
import { AppLayout } from "@layouts/app-layout"
import { observer } from "mobx-react"
import { NextPageWithLayout } from "@/types/types"

const ProjectModulesPage: NextPageWithLayout = observer(() => {
    const router = useRouter()
    const { projectId } = router.query
    // store
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Modules` : undefined

    return (
        <>
            <PageHead title={pageTitle} />
            <ModulesListView />
        </>
    )
})

ProjectModulesPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout header={<ModulesListHeader />} withProjectWrapper>
            {page}
        </AppLayout>
    )
}

export default ProjectModulesPage
