"use client"

import { useParams } from "next/navigation"

import { useState } from "react"

import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"

import { PageHead } from "@components/core"
import { CycleCreateUpdateModal } from "@components/cycles"
import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { WorkspaceActiveCycleHeader } from "@components/headers"
import { CycleModuleListLayout } from "@components/ui"
import { WorkspaceActiveCycleRoot } from "@components/workspace"

import { useCycle, useUser, useWorkspace } from "@hooks/store"

import { CYCLE_EMPTY_STATE_DETAILS } from "@constants/empty-state"
import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"

const WorkspaceActiveCyclesPage = observer(() => {
    const [createModal, setCreateModal] = useState(false)
    // theme
    const { resolvedTheme } = useTheme()
    // store hooks
    const {
        membership: { currentProjectRole },
        currentUser,
    } = useUser()
    const { currentProjectCycleIds, loader } = useCycle()
    const { workspaceSlug } = useParams()
    const { currentWorkspace } = useWorkspace()
    // derived values
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const EmptyStateImagePath = getEmptyStateImagePath("onboarding", "cycles", isLightMode)
    const totalCycles = currentProjectCycleIds?.length ?? 0
    const isEditingAllowed = currentProjectRole !== undefined && currentProjectRole >= ERoles.MEMBER
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
                {loader ? (
                    <CycleModuleListLayout />
                ) : totalCycles === 0 ? (
                    <div className="h-full place-items-center">
                        <EmptyState
                            title={CYCLE_EMPTY_STATE_DETAILS["active"].title}
                            description={CYCLE_EMPTY_STATE_DETAILS["active"].description}
                            image={EmptyStateImagePath}
                            size="lg"
                            disabled={!isEditingAllowed}
                        />
                    </div>
                ) : (
                    <WorkspaceActiveCycleRoot workspaceSlug={workspaceSlug.toString()} />
                )}
            </div>
        </AppWrapper>
    )
})

export default WorkspaceActiveCyclesPage
