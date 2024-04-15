"use client"

import { useParams } from "next/navigation"

import { useState } from "react"

import { isEmpty } from "lodash"
import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { CycleCreateUpdateModal } from "@components/cycles"
import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { WorkspaceActiveCycleHeader } from "@components/headers"
import { WorkspaceActiveCycleRoot } from "@components/workspace"

import { useCycle, useUser, useWorkspace } from "@hooks/store"

import { CYCLE_EMPTY_STATE_DETAILS } from "@constants/empty-state"

import { AppWrapper } from "@wrappers/app"

import { ICycle } from "@servcy/types"
import { Loader } from "@servcy/ui"

const WorkspaceActiveCyclesPage = observer(() => {
    const { workspaceSlug } = useParams()
    const [workspaceCycles, setWorkspaceCycles] = useState<{
        [projectId: string]: ICycle[]
    }>({})
    const { fetchActiveWorkspaceCycles } = useCycle()
    const { isLoading } = useSWR(
        workspaceSlug ? `WORKSPACE_ACTIVE_CYCLES_${workspaceSlug}` : null,
        workspaceSlug
            ? async () => {
                  const response = await fetchActiveWorkspaceCycles(workspaceSlug.toString())
                  setWorkspaceCycles(response)
              }
            : null
    )
    const { resolvedTheme } = useTheme()
    const { currentUser } = useUser()
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const emptyStateImage = getEmptyStateImagePath("cycle", "active", isLightMode)
    if (!workspaceSlug) return null
    const [createModal, setCreateModal] = useState(false)
    const { currentWorkspace } = useWorkspace()
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Active Cycles` : undefined

    return (
        <AppWrapper header={<WorkspaceActiveCycleHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="w-full h-full">
                <CycleCreateUpdateModal
                    workspaceSlug={workspaceSlug.toString()}
                    isOpen={createModal}
                    handleClose={() => setCreateModal(false)}
                />
                <div className="h-full space-y-5 overflow-y-auto p-4 sm:p-5">
                    {isLoading ? (
                        <Loader>
                            <Loader.Item height="250px" />
                        </Loader>
                    ) : isEmpty(workspaceCycles) ? (
                        <EmptyState
                            title={CYCLE_EMPTY_STATE_DETAILS["active"].title}
                            description={CYCLE_EMPTY_STATE_DETAILS["active"].description}
                            image={emptyStateImage}
                            size="sm"
                        />
                    ) : (
                        Object.keys(workspaceCycles).map((projectId) => (
                            <>
                                {workspaceCycles[projectId].map((activeCycle) => (
                                    <WorkspaceActiveCycleRoot
                                        key={activeCycle.id}
                                        projectId={projectId}
                                        activeCycle={activeCycle}
                                        workspaceSlug={workspaceSlug.toString()}
                                    />
                                ))}
                            </>
                        ))
                    )}
                </div>
            </div>
        </AppWrapper>
    )
})

export default WorkspaceActiveCyclesPage
