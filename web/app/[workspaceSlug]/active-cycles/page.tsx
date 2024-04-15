"use client"

import { useParams } from "next/navigation"

import { useState } from "react"

import { observer } from "mobx-react-lite"

import { PageHead } from "@components/core"
import { CycleCreateUpdateModal } from "@components/cycles"
import { WorkspaceActiveCycleHeader } from "@components/headers"
import { WorkspaceActiveCycleRoot } from "@components/workspace"

import { useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

const WorkspaceActiveCyclesPage = observer(() => {
    const [createModal, setCreateModal] = useState(false)
    const { workspaceSlug } = useParams()
    const { currentWorkspace } = useWorkspace()
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Active Cycles` : undefined

    if (!workspaceSlug) return null

    return (
        <AppWrapper header={<WorkspaceActiveCycleHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="w-full h-full">
                <CycleCreateUpdateModal
                    workspaceSlug={workspaceSlug.toString()}
                    isOpen={createModal}
                    handleClose={() => setCreateModal(false)}
                />
                <WorkspaceActiveCycleRoot workspaceSlug={workspaceSlug.toString()} />
            </div>
        </AppWrapper>
    )
})

export default WorkspaceActiveCyclesPage
