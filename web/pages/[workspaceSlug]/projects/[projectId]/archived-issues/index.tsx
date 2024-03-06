import { useRouter } from "next/router"
import { ReactElement } from "react"
import { PageHead } from "@components/core"
import { ProjectArchivedIssuesHeader } from "@components/headers"
import { ArchivedIssueLayoutRoot } from "@components/issues"
import { useProject } from "@hooks/store"
import { AppLayout } from "@layouts/app-layout"
import { observer } from "mobx-react"
import { NextPageWithLayout } from "@/types/types"

const ProjectArchivedIssuesPage: NextPageWithLayout = observer(() => {
    // router
    const router = useRouter()
    const { projectId } = router.query
    // store hooks
    const { getProjectById } = useProject()
    // derived values
    const project = projectId ? getProjectById(projectId.toString()) : undefined
    const pageTitle = project?.name && `${project?.name} - Archived issues`

    return (
        <>
            <PageHead title={pageTitle} />
            <ArchivedIssueLayoutRoot />
        </>
    )
})

ProjectArchivedIssuesPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout header={<ProjectArchivedIssuesHeader />} withProjectWrapper>
            {page}
        </AppLayout>
    )
}

export default ProjectArchivedIssuesPage
