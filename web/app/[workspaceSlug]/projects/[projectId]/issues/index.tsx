import Head from "next/head"
import { useRouter } from "next/router"

import { ReactElement } from "react"

import { NextPageWithLayout } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { ProjectIssuesHeader } from "@components/headers"
import { ProjectLayoutRoot } from "@components/issues"

import { useProject } from "@hooks/store"

import { AppLayout } from "@layouts/app-layout"

const ProjectIssuesPage: NextPageWithLayout = observer(() => {
    const router = useRouter()
    const { projectId } = router.query
    // store
    const { getProjectById } = useProject()

    if (!projectId) {
        return <></>
    }

    // derived values
    const project = getProjectById(projectId.toString())
    const pageTitle = project?.name ? `${project?.name} - Issues` : undefined

    return (
        <>
            <PageHead title={pageTitle} />
            <Head>
                <title>{project?.name} - Issues</title>
            </Head>
            <div className="h-full w-full">
                <ProjectLayoutRoot />
            </div>
        </>
    )
})

ProjectIssuesPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout header={<ProjectIssuesHeader />} withProjectWrapper>
            {page}
        </AppLayout>
    )
}

export default ProjectIssuesPage
